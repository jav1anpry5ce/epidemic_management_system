class IdelTimer {
  constructor({ timeout, onTimeout, onExpired }) {
    this.timeout = timeout;
    this.onTimeout = onTimeout;

    const expiredTime = parseInt(sessionStorage.getItem("_expiredTime"), 10);
    if (expiredTime > 0 && expiredTime < Date.now()) {
      onExpired();
      return;
    }
    this.eventHandler = this.updateExpiredTime.bind(this);
    this.tracker();
    this.startInterval();
  }
  startInterval() {
    this.updateExpiredTime();

    this.interval = setInterval(() => {
      const expiredTime = parseInt(sessionStorage.getItem("_expiredTime"), 10);
      if (expiredTime < Date.now()) {
        if (this.onTimeout) {
          this.onTimeout();
          this.cleanUp();
        }
      }
    }, 10);
  }
  updateExpiredTime() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    this.timeoutTracker = setTimeout(() => {
      sessionStorage.setItem("_expiredTime", Date.now() + this.timeout * 1000);
    }, 300);
  }
  tracker() {
    window.addEventListener("mouseover", this.eventHandler);
    window.addEventListener("scroll", this.eventHandler);
    window.addEventListener("keydown", this.eventHandler);
  }
  cleanUp() {
    sessionStorage.removeItem("_expiredTime");
    clearInterval(this.interval);
    window.addEventListener("mouseover", this.eventHandler);
    window.addEventListener("scroll", this.eventHandler);
    window.addEventListener("keydown", this.eventHandler);
  }
}

export default IdelTimer;
