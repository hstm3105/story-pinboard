import { ScriptLine } from './types';

export class WebSpeechSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public speakScript(
    lines: ScriptLine[],
    onLineStart?: (lineId: string) => void,
    onComplete?: () => void
  ) {
    if (!this.synth) {
      console.warn('Web Speech Synthesis API not supported in this browser.');
      return;
    }

    this.stop();
    this.isPlaying = true;
    this.loadVoices();

    const englishVoices = this.voices.filter((v) => v.lang.startsWith('en'));
    const narratorVoice = englishVoices[0] || this.voices[0];
    const maleVoice = englishVoices.find((v) => v.name.includes('Male') || v.name.includes('David') || v.name.includes('George')) || englishVoices[1] || narratorVoice;
    const femaleVoice = englishVoices.find((v) => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Hazel')) || englishVoices[2] || narratorVoice;

    lines.forEach((line, index) => {
      if (line.type === 'sfx') {
        // Brief pause for SFX
        return;
      }

      const utterance = new SpeechSynthesisUtterance(line.text);

      if (line.type === 'narrator') {
        utterance.voice = narratorVoice;
        utterance.pitch = 0.9;
        utterance.rate = 0.95;
      } else {
        const charUpper = (line.character || '').toUpperCase();
        if (charUpper.includes('KAI') || charUpper.includes('ARCHER') || charUpper.includes('MALE')) {
          utterance.voice = maleVoice;
          utterance.pitch = 0.8;
          utterance.rate = 1.0;
        } else {
          utterance.voice = femaleVoice;
          utterance.pitch = 1.1;
          utterance.rate = 1.05;
        }
      }

      utterance.onstart = () => {
        if (onLineStart) onLineStart(line.id);
      };

      if (index === lines.length - 1) {
        utterance.onend = () => {
          this.isPlaying = false;
          if (onComplete) onComplete();
        };
      }

      this.synth?.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
