class QnectCarousel {
	constructor(carousel,dots = null) {
		this.elements = {
			carousel: carousel,
			slider: carousel.children[1].children[0],
			dots: dots
		};

		this.slides;
		this.index = 0;

		this.setSlides();
		this.updateDot();
		this.attachEventListeners();
	}

	pauseVideos() {
		if(!players || players.length < 1) {
			return false;
		}

		players.forEach(player => player.pauseVideo());
	}

	slidesCount() {
		return this.slides.length;
	}

	// Update the slide selector/indicator dots with the current index
	updateDot() {
		if(!this.elements.dots) {
			return false;
		}

		const dots = this.elements.dots.children;

		for(const dot of dots) {
			dot.classList.remove("active");
		}
		dots[this.index].classList.add("active");
	}

	// Update slides with the current index
	updateSlide() {
		for(const slide of this.slides) {
			slide.classList.remove("active");
		}
		this.slides[this.index].classList.add("active");
	}

	// Scroll to slide by index
	scrollTo(index) {
		if(index < 0) {
			this.scrollTo(this.slidesCount() - 1);
			return false;
		} else if(index > this.slidesCount() - 1) {
			this.scrollTo(0);
			return false;
		}

		this.pauseVideos();

		const percent = 100 / this.slidesCount();
		const translate = percent * index;

		this.elements.slider.style.setProperty("transform",`translateX(-${translate}%)`);
		this.index = parseInt(index);

		// UI update
		this.updateSlide();
		this.updateDot();
	}

	// Scroll relative to current index
	// Positive int goes forwards, negative int goes backwards
	scroll(direction) {
		this.scrollTo(this.index + direction);
		
		// Remove the loading spinner
		this.elements.carousel.children[1].style.setProperty("background-image","unset");
	}

	// -- Init --

	// Count the number of loaded slides
	setSlides() {
		this.slides = this.elements.slider.children;
		this.elements.slider.style.setProperty("--length",this.slidesCount());
	}

	// Bind interactive elements
	attachEventListeners() {
		const children = this.elements.carousel.children;
		children[0].addEventListener("click",() => this.scroll(-1)); // Previous side button
		children[2].addEventListener("click",() => this.scroll(1)); // Next side button

		if(this.elements.dots) {
			const dots = this.elements.dots.children;
			for(const [index,dot] of Object.entries(dots)) {
				dot.addEventListener("click",() => this.scrollTo(index));
			}
		}
	}
}

// Initialize the carousel
const carouselElem = document.getElementById("carousel");
const carouselDotsElem = document.getElementById("carouselDots");
const carousel = new QnectCarousel(carouselElem,carouselDotsElem);

// Scroll to the middle slide
carousel.scrollTo(Math.floor(carousel.slidesCount() / 2));