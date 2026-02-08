/**
 * Interactive SVG Animation Playground
 * Controls, sliders, and animation triggers
 */

class AnimationPlayground {
  constructor() {
    this.svg = document.getElementById('playground-svg');
    this.mainShape = document.getElementById('shape-main');
    this.orbits = [
      document.getElementById('shape-orbit-1'),
      document.getElementById('shape-orbit-2'),
      document.getElementById('shape-orbit-3')
    ];
    this.group = document.getElementById('animated-shape');

    // Animation state
    this.state = {
      speed: 1,
      scale: 1,
      radius: 60,
      easing: 'ease-in-out',
      isPlaying: true,
      currentAngle: 0
    };

    // Animation frame
    this.animationId = null;
    this.lastTime = 0;

    this.init();
  }

  init() {
    this.bindControls();
    this.bindTriggers();
    this.startAnimation();
  }

  bindControls() {
    // Speed control
    const speedCtrl = document.getElementById('ctrl-speed');
    const speedVal = document.getElementById('val-speed');
    speedCtrl.addEventListener('input', (e) => {
      this.state.speed = parseFloat(e.target.value);
      speedVal.textContent = `${this.state.speed}x`;
    });

    // Scale control
    const scaleCtrl = document.getElementById('ctrl-scale');
    const scaleVal = document.getElementById('val-scale');
    scaleCtrl.addEventListener('input', (e) => {
      this.state.scale = parseFloat(e.target.value);
      scaleVal.textContent = `${this.state.scale}x`;
      this.mainShape.setAttribute('r', 40 * this.state.scale);
    });

    // Radius control
    const radiusCtrl = document.getElementById('ctrl-radius');
    const radiusVal = document.getElementById('val-radius');
    radiusCtrl.addEventListener('input', (e) => {
      this.state.radius = parseInt(e.target.value);
      radiusVal.textContent = `${this.state.radius}px`;
    });

    // Easing control
    const easingCtrl = document.getElementById('ctrl-easing');
    easingCtrl.addEventListener('change', (e) => {
      this.state.easing = e.target.value;
    });
  }

  bindTriggers() {
    const triggers = document.querySelectorAll('.trigger-btn');
    triggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const trigger = btn.dataset.trigger;
        this.executeTrigger(trigger);
      });
    });
  }

  executeTrigger(trigger) {
    switch (trigger) {
      case 'pulse':
        this.triggerPulse();
        break;
      case 'explode':
        this.triggerExplode();
        break;
      case 'morph':
        this.triggerMorph();
        break;
      case 'reset':
        this.triggerReset();
        break;
    }
  }

  triggerPulse() {
    const duration = 600 / this.state.speed;
    this.mainShape.style.transition = `transform ${duration}ms ${this.getEasing()}`;
    this.mainShape.style.transform = 'scale(1.5)';

    setTimeout(() => {
      this.mainShape.style.transform = 'scale(1)';
    }, duration);

    setTimeout(() => {
      this.mainShape.style.transition = '';
      this.mainShape.style.transform = '';
    }, duration * 2);
  }

  triggerExplode() {
    const duration = 400 / this.state.speed;

    this.orbits.forEach((orbit, i) => {
      const angle = (i * 120) * (Math.PI / 180);
      const distance = this.state.radius * 2;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      orbit.style.transition = `transform ${duration}ms ${this.getEasing()}, opacity ${duration}ms`;
      orbit.style.transform = `translate(${x}px, ${y}px) scale(0)`;
      orbit.style.opacity = '0';
    });

    setTimeout(() => {
      this.orbits.forEach(orbit => {
        orbit.style.transition = `transform ${duration}ms ${this.getEasing()}, opacity ${duration}ms`;
        orbit.style.transform = '';
        orbit.style.opacity = '';
      });
    }, duration);

    setTimeout(() => {
      this.orbits.forEach(orbit => {
        orbit.style.transition = '';
      });
    }, duration * 2);
  }

  triggerMorph() {
    const duration = 800 / this.state.speed;

    // Morph to different shapes using rx/ry attributes
    this.mainShape.style.transition = `all ${duration}ms ${this.getEasing()}`;

    // Sequence through shapes
    const shapes = [
      { rx: 40, ry: 20 },  // Horizontal ellipse
      { rx: 20, ry: 40 },  // Vertical ellipse
      { rx: 10, ry: 10 },  // Small circle
      { rx: 40, ry: 40 }   // Back to normal
    ];

    shapes.forEach((shape, i) => {
      setTimeout(() => {
        // For circle element, we animate the r attribute via scale
        const scaleX = shape.rx / 40;
        const scaleY = shape.ry / 40;
        this.mainShape.style.transform = `scale(${scaleX}, ${scaleY})`;
      }, i * (duration / 2));
    });

    setTimeout(() => {
      this.mainShape.style.transition = '';
      this.mainShape.style.transform = '';
    }, shapes.length * (duration / 2) + 100);
  }

  triggerReset() {
    // Reset all controls
    document.getElementById('ctrl-speed').value = 1;
    document.getElementById('val-speed').textContent = '1x';
    this.state.speed = 1;

    document.getElementById('ctrl-scale').value = 1;
    document.getElementById('val-scale').textContent = '1x';
    this.state.scale = 1;
    this.mainShape.setAttribute('r', 40);

    document.getElementById('ctrl-radius').value = 60;
    document.getElementById('val-radius').textContent = '60px';
    this.state.radius = 60;

    document.getElementById('ctrl-easing').value = 'ease-in-out';
    this.state.easing = 'ease-in-out';

    // Reset transforms
    this.mainShape.style.transform = '';
    this.orbits.forEach(orbit => {
      orbit.style.transform = '';
      orbit.style.opacity = '';
    });
  }

  getEasing() {
    const easings = {
      'linear': 'linear',
      'ease-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };
    return easings[this.state.easing] || 'ease-in-out';
  }

  startAnimation() {
    const animate = (currentTime) => {
      if (!this.lastTime) this.lastTime = currentTime;
      const delta = currentTime - this.lastTime;
      this.lastTime = currentTime;

      // Update angle based on speed
      this.state.currentAngle += (delta * 0.001 * this.state.speed);

      // Update orbit positions
      this.orbits.forEach((orbit, i) => {
        const offset = (i * 2 * Math.PI) / 3;
        const angle = this.state.currentAngle + offset;

        const x = Math.cos(angle) * this.state.radius;
        const y = Math.sin(angle) * this.state.radius;

        orbit.setAttribute('cx', x);
        orbit.setAttribute('cy', y);
      });

      // Continue animation
      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AnimationPlayground();
});
