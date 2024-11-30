class ImageSlider {
    constructor(container, options) {
      this.container = container;
      this.images = options.images || [];
      this.loop = options.loop || false;
      this.navs = options.navs || false;
      this.pagination = options.pagination || false;
      this.delay = options.delay || 2000;
      this.stopMouseHover = options.stopMouseHover || false;
      this.currentIndex = 0;
      this.interval = null;
  
      this.init();
    }
  
    init() {
      this.render();
      this.startSlider();
    }
  
    render() {
      this.container.innerHTML = '';
  
      // Create image wrapper
      const sliderWrapper = document.createElement('div');
      sliderWrapper.classList.add('slider-wrapper');
  
      this.images.forEach((image, index) => {
        const slideContainer = document.createElement('div');
        slideContainer.classList.add('slide-container');
        
        const slideNumber = document.createElement('div');
        slideNumber.classList.add('slide-number');
        slideNumber.textContent = `${index + 1}/${this.images.length}`;
        
        const link = document.createElement('a');
        this.links = ["about_us", "services", "contacts", "news"];
        link.href = `/${this.links[index]}/`;
        
        const img = document.createElement('img');
        img.src = image;
        img.classList.add('slider-image');
        
        slideContainer.style.display = index === this.currentIndex ? 'block' : 'none';
        img.style.opacity = index === this.currentIndex ? '1' : '0';
        
        link.appendChild(img);
        slideContainer.appendChild(slideNumber);
        slideContainer.appendChild(link);
        
        const slideTitle = document.createElement('div');
        slideTitle.classList.add('slide-title');
        slideTitle.textContent = `Slide ${index + 1}`;
        slideContainer.appendChild(slideTitle);

        sliderWrapper.appendChild(slideContainer);
      });
  
      this.container.appendChild(sliderWrapper);
  
      if (this.navs) {
        const prevButton = document.createElement('i');
        prevButton.textContent = '❮';
        prevButton.classList.add('nav-button', 'prev-button');
        prevButton.addEventListener('click', () => this.prevSlide());
        this.container.insertBefore(prevButton, sliderWrapper);
  
        const nextButton = document.createElement('i');
        nextButton.textContent = '❯';
        nextButton.classList.add('nav-button', 'next-button');
        nextButton.addEventListener('click', () => this.nextSlide());
        this.container.insertBefore(nextButton, sliderWrapper.nextSibling);
  
        // Initial button visibility
        if (!this.loop) {
          this.updateNavButtons();
        }
      }
  
      // Add pagination dots
      if (this.pagination) {
        const paginationWrapper = document.createElement('div');
        paginationWrapper.classList.add('pagination');
        this.images.forEach((_, index) => {
          const dot = document.createElement('span');
          dot.textContent = '●';
          dot.style.cursor = 'pointer';
          dot.classList.add('pagination-dot');
          if (index === this.currentIndex) {
            dot.classList.add('active');
          }
          dot.addEventListener('click', () => this.goToSlide(index));
          paginationWrapper.appendChild(dot);
        });
        this.container.parentNode.insertBefore(paginationWrapper, this.container.nextSibling);
        this.updateVisibleDots();
      }
  
      // Add mouse hover stop feature
      if (this.stopMouseHover) {
        this.container.getElementsByClassName('slider-wrapper')[0].addEventListener('mouseenter', () => this.stopSlider());
        this.container.getElementsByClassName('slider-wrapper')[0].addEventListener('mouseleave', () => this.startSlider());
      }
    }
  
    startSlider() {
      this.stopSlider();
      this.interval = setInterval(() => this.nextSlide(), this.delay);
    }
  
    stopSlider() {
      clearInterval(this.interval);
    }
  
    nextSlide() {
      if (!this.loop && this.currentIndex === this.images.length - 1 || this.direction === 'prev') {
        this.direction = 'prev';
        this.prevSlide();
        return;
      }
      this.direction = 'next';
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.updateSlides();
    }
  
    prevSlide() {
      if (!this.loop && this.currentIndex === 0 || this.direction === 'next') {
        this.direction = 'next';
        this.nextSlide();
        return;
      }
      this.direction = 'prev';
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.updateSlides();
    }
  
    goToSlide(index) {
      this.currentIndex = index;
      this.updateSlides();
    }
  
    updateSlides() {
      const slides = this.container.querySelectorAll('.slide-container');
      const images = this.container.querySelectorAll('.slider-image');
      
      slides.forEach((slide, index) => {
        if (index === this.currentIndex) {
          slide.style.display = 'block';
          images[index].style.opacity = '1';
        } else {
          slide.style.display = 'none';
          images[index].style.opacity = '0';
        }
      });
      
      if (this.pagination) {
        const dots = this.container.nextElementSibling.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === this.currentIndex);
        });
        this.updateVisibleDots();
      }
  
      if (!this.loop) {
        this.updateNavButtons();
      }
    }

    updateVisibleDots() {
      const dots = this.container.nextElementSibling.querySelectorAll('.pagination-dot');
      dots.forEach((dot, index) => {
        const distance = Math.abs(index - this.currentIndex);
        if (distance <= 1) {
          dot.classList.remove('hidden');
        } else {
          dot.classList.add('hidden');
        }
      });
    }

    updateNavButtons() {
      if (!this.loop) {
        const prevButton = this.container.querySelector('.prev-button');
        const nextButton = this.container.querySelector('.next-button');
        
        if (prevButton) {
          prevButton.style.display = this.currentIndex === 0 ? 'none' : 'block';
        }
        if (nextButton) {
          nextButton.style.display = this.currentIndex === this.images.length - 1 ? 'none' : 'block';
        }
      }
    }
  }

  //------------------------------------------------------------------------------

const sliderContainer = document.getElementById('slider-container');
const form = document.getElementById('slider-config');

// Example images
const images = [
  '/static/images/banner_ad_1.png',
  '/static/images/banner_ad_2.png',
  '/static/images/banner_ad_3.png',
  '/static/images/banner_ad_4.png',
];

let slider = new ImageSlider(sliderContainer, {
  images,
  loop: true,
  navs: true,
  pagination: true,
  delay: 3500,
  stopMouseHover: true,
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const options = {
    images,
    loop: formData.get('loop') === 'true',
    navs: formData.get('navs') === 'true',
    pagination: formData.get('pagination') === 'true',
    delay: parseInt(formData.get('delay'), 10),
    stopMouseHover: formData.get('stopMouseHover') === 'true',
  };

  if(document.getElementsByClassName('pagination').length > 0) {
    document.getElementsByClassName('pagination')[0].remove();
  }
  slider.stopSlider();
  slider = new ImageSlider(sliderContainer, options);
});
