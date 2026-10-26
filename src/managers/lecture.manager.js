const fs = require('fs');
const path = require('path');
const logger = require('../core/logger').createServiceLogger('LECTURE');

/**
 * Lecture capture: the user marks the start and end of an important stretch
 * of a class (Alt+L), the computer's audio is transcribed while it plays, and
 * the clip is turned into study notes. This manager holds the clip in progress
 * and appends finished clips to one Markdown notes file per day.
 */
class LectureManager {
  constructor() {
    this.active = false;     // capturing audio right now
    this.finishing = false;  // stopped; last segments and notes still running
    this.parts = [];
    this.startedAt = null;
    this.endedAt = null;
  }

  start() {
    this.active = true;
    this.finishing = false;
    this.parts = [];
    this.startedAt = new Date();
    this.endedAt = null;
    logger.info('Lecture capture started');
  }

  stop() {
    this.active = false;
    this.finishing = true;
    this.endedAt = new Date();
  }

  /** True while transcriptions belong to the lecture clip, not to a voice question. */
  isCapturing() {
    return this.active || this.finishing;
  }

  addTranscript(text) {
    const clean = (text || '').trim();
    if (clean) {
      this.parts.push(clean);
    }
  }

  wordCount() {
    return this.parts.join(' ').split(/\s+/).filter(Boolean).length;
  }

  elapsedMs() {
    if (!this.startedAt) return 0;
    return (this.endedAt || new Date()) - this.startedAt;
  }

  /** The finished clip; resets the manager so the next Alt+L starts fresh. */
  takeClip() {
    const clip = {
      text: this.parts.join(' ').trim(),
      startedAt: this.startedAt,
      endedAt: this.endedAt || new Date(),
      words: this.wordCount()
    };
    this.active = false;
    this.finishing = false;
    this.parts = [];
    return clip;
  }

  notesDir() {
    const { app } = require('electron');
    return path.join(app.getPath('documents'), 'OpenCluely Lectures');
  }

  /**
   * Append a clip's notes and transcript to today's notes file.
   * @returns {string} the notes file path
   */
  appendToNotes({ startedAt, endedAt, notes, transcript }) {
    const dir = this.notesDir();
    fs.mkdirSync(dir, { recursive: true });

    const day = toLocalDate(startedAt);
    const filePath = path.join(dir, `${day} Lectures.md`);
    const minutes = Math.max(1, Math.round((endedAt - startedAt) / 60000));

    const sections = [];
    if (!fs.existsSync(filePath)) {
      sections.push(`# Lecture notes, ${startedAt.toDateString()}\n`);
    }
    sections.push(
      `## ${toLocalTime(startedAt)}–${toLocalTime(endedAt)} (${minutes} min)\n`,
      `${notes.trim()}\n`,
      '<details>',
      '<summary>Transcript</summary>\n',
      `${transcript.trim()}\n`,
      '</details>\n',
      '---\n'
    );

    fs.appendFileSync(filePath, sections.join('\n') + '\n', 'utf8');
    logger.info('Lecture notes saved', { filePath, minutes });
    return filePath;
  }
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function toLocalDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toLocalTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

module.exports = new LectureManager();
