/**
 * SoundManager - Handles background music (BGM) playback with user preferences
 */

export class SoundManager {
  private bgm: HTMLAudioElement | null = null;
  private bgmVolume = 0.3;
  private isPlaying = false;

  /**
   * Load BGM audio file
   */
  loadBGM(src: string) {
    if (typeof window === "undefined") return;

    this.bgm = new Audio(src);
    this.bgm.loop = true;
    this.bgm.volume = this.bgmVolume;

    // Load preferences from localStorage
    this.loadPreferences();
  }

  /**
   * Play BGM (only works after user interaction due to browser autoplay policy)
   */
  async playBGM() {
    if (!this.bgm) return false;

    try {
      await this.bgm.play();
      this.isPlaying = true;
      this.savePreferences();
      return true;
    } catch (error) {
      console.warn("Failed to play BGM:", error);
      return false;
    }
  }

  /**
   * Pause BGM
   */
  pauseBGM() {
    if (!this.bgm) return;

    this.bgm.pause();
    this.isPlaying = false;
    this.savePreferences();
  }

  /**
   * Toggle play/pause
   */
  async toggleBGM() {
    if (this.isPlaying) {
      this.pauseBGM();
      return false;
    } else {
      return await this.playBGM();
    }
  }

  /**
   * Set BGM volume (0.0 to 1.0)
   */
  setBGMVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgm) {
      this.bgm.volume = this.bgmVolume;
    }
    this.savePreferences();
  }

  /**
   * Get current playing state
   */
  getIsPlaying() {
    return this.isPlaying;
  }

  /**
   * Get current volume
   */
  getVolume() {
    return this.bgmVolume;
  }

  /**
   * Load user preferences from localStorage
   */
  private loadPreferences() {
    if (typeof window === "undefined") return;

    try {
      const savedVolume = localStorage.getItem("routinehero_bgm_volume");
      const savedPlaying = localStorage.getItem("routinehero_bgm_playing");

      if (savedVolume) {
        this.bgmVolume = parseFloat(savedVolume);
        if (this.bgm) {
          this.bgm.volume = this.bgmVolume;
        }
      }

      if (savedPlaying === "true" && this.bgm) {
        // Don't auto-play here - browser will block it
        // User must click the button first
        this.isPlaying = false;
      }
    } catch (error) {
      console.warn("Failed to load BGM preferences:", error);
    }
  }

  /**
   * Save user preferences to localStorage
   */
  private savePreferences() {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("routinehero_bgm_volume", this.bgmVolume.toString());
      localStorage.setItem("routinehero_bgm_playing", this.isPlaying.toString());
    } catch (error) {
      console.warn("Failed to save BGM preferences:", error);
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();
