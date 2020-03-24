let isArrows = false;
/*
 * @param {Object} props Consider slider preferences
 * @param {Object} props.class CSS class name
 * @param {Object} props.color Buttons color
 * @param {Object} props.duration Time of execution
 * @param {Object} props.delay Delay time between slides
 * @param {Object} props.arrows Arrow buttons on surface
 */
export default function initSlider(props = false) {
  window.sliders_array = [];
  let { className } = setStyles(props);
  let { arrows } = props;
  if (arrows) isArrows = true;
  window.nextSlideDuration = props && props.duration ? props.duration : 1000;
  window.nextSlideDelay = props && props.delay ? props.delay : 3000;
  const sliders = document.querySelectorAll(`.${className}`);
  for (let i = 0; i < sliders.length; i++) {
    let buttons;
    if (!isArrows) {
      buttons = document.createElement('div');
      buttons.className = `${className}__buttons`;
      sliders[i].appendChild(buttons);
    } else {
      buttons = document.createElement('div');
      buttons.className = `${className}__arrows`;
      sliders[i].appendChild(buttons);
    }
    window.sliders_array.push({
      width: sliders[i].querySelector(`.${className}__slides`).offsetWidth,
      height: sliders[i].querySelector(
        `.${className}__slides > .${className}__slide`,
      ).offsetHeight,
      vertical: sliders[i].classList.contains(`${className}_vertical`),
      amount:
        sliders[i].querySelector(`.${className}__slides`).children.length - 1,
      current: 0,
      interval: null,
      slides: sliders[i].querySelector(`.${className}__slides`),
      buttons: isArrows
        ? buttons
        : sliders[i].querySelector(`.${className}__buttons`),
      className,
    });
    sliders[i].querySelector(`.${className}__slides`).style.height =
      window.sliders_array[i].height + 'px';
    if (!props || !props.arrows) {
      for (let a = 0; a < window.sliders_array[i].amount + 1; a++) {
        const button = document.createElement('div');
        button.className =
          `${className}__button` +
          (a === 0 ? ` ${className}__button_active` : '');
        button.addEventListener('click', () => {
          clearTimeout(window.sliders_array[i].interval);
          window.sliders_array[i].interval = null;
          nextSlide(i, a);
        });
        window.sliders_array[i].buttons.appendChild(button);
      }
    } else {
      const buttonL = document.createElement('div');
      buttonL.className = `${className}__arrow ${className}__arrow_left`;
      buttonL.addEventListener('click', () => {
        clearTimeout(window.sliders_array[i].interval);
        window.sliders_array[i].interval = null;
        nextSlide(i, window.sliders_array[i].current - 1);
      });
      const buttonR = document.createElement('div');
      buttonR.className = `${className}__arrow ${className}__arrow_right`;
      buttonR.addEventListener('click', () => {
        clearTimeout(window.sliders_array[i].interval);
        window.sliders_array[i].interval = null;
        nextSlide(i);
      });
      window.sliders_array[i].buttons.appendChild(buttonL);
      window.sliders_array[i].buttons.appendChild(buttonR);
    }
    window.sliders_array[i].interval = setTimeout(() => {
      nextSlide(i);
    }, window.nextSlideDelay);
  }
}

/*
 * TODO: Добавить обработку изменения экрана
 * TODO: Добавить деструктор
 */
async function nextSlide(n, next = -1) {
  let time_start = performance.now();
  let {
    className,
    width,
    height,
    vertical,
    slides,
    amount,
    current,
    buttons,
    interval,
  } = window.sliders_array[n];
  const scroll_start = vertical ? slides.scrollTop : slides.scrollLeft;
  next = next > -1 ? next : current === amount ? 0 : current + 1;
  if (!isArrows) {
    buttons
      .querySelector(`.${className}__button_active`)
      .classList.remove(`${className}__button_active`);
    buttons.children[next].classList.add(`${className}__button_active`);
  }
  window.sliders_array[n].current = next;
  let start_offset = scroll_start - (vertical ? height : width) * current;
  await new Promise(resolve => {
    window.requestAnimationFrame(function animate(time) {
      let timeFraction = (time - time_start) / window.nextSlideDuration;
      if (timeFraction > 1) timeFraction = 1;

      if (vertical) {
        slides.scrollTo(
          0,
          scroll_start +
            (next - current === 0 ? 1 : next - current) *
              (height + start_offset) *
              timeFraction,
        );
      } else {
        slides.scrollTo(
          scroll_start +
            (next - current === 0 ? 1 : next - current) *
              (width + start_offset) *
              timeFraction,
          0,
        );
      }

      if (timeFraction < 1) {
        window.requestAnimationFrame(animate);
      } else {
        resolve();
      }
    });
  });
  if (interval === window.sliders_array[n].interval) {
    window.sliders_array[n].interval = setTimeout(() => {
      nextSlide(n);
    }, window.nextSlideDelay);
  }
}

function setStyles(props) {
  let className =
    props && props.class !== undefined ? props.class : 'axialslider';
  let color = props && props.color !== undefined ? props.color : '#19bd9a';
  let slidePadding = `
      padding: 0 150px;
      box-sizing: border-box;
  `;
  let styles = `
        .${className} {
            position: relative;
        }
        .${className}_vertical {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .${className}_vertical > .${className}__buttons {
            margin-top: 0 !important;
            display: block !important;
        }
        .${className}_vertical > .${className}__slides {
            display: block !important;
            overflow-y: hidden;
        }
        .${className}_vertical > .${className}__slides > .${className}__slide {
            height: 100% !important;
        }
        .${className}__slides {
            display: flex;
            width: 100%;
            overflow-x: hidden;
        }
        .${className}__slide {
            min-width: 100% !important;
            ${isArrows ? slidePadding : ''}
        }
        .${className}__buttons {
            margin-top: 2rem;
            display: flex;
            justify-content: center;
        }
        .${className}__button {
            width: 10px;
            height: 10px;
            border-radius: 100%;
            border: 1px solid ${color};
            margin: 10px;
            cursor: pointer;
        }
        .${className}__button_active {
            background-color: ${color};
        }
        .${className}__arrows {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        .${className}__arrow {
            width: 30px;
            height: 30px;
            border-radius: 100%;
            background-color: ${color};
            cursor: pointer;
            -webkit-box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.3);
            -moz-box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.3);
            box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.3);
            background-size: 13px 13px;
            background-repeat: no-repeat;
        }
        .${className}__arrow:hover {
            -webkit-box-shadow: 0px 3px 8px 0px rgba(0,0,0,0.3);
            -moz-box-shadow: 0px 3px 8px 0px rgba(0,0,0,0.3);
            box-shadow: 0px 3px 8px 0px rgba(0,0,0,0.3);
        }
        .${className}__arrow:active {
            -webkit-box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.3);
            -moz-box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.3);
            box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.3);
        }
        .${className}__arrow_left {
            margin-left: 85px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 257.57 451.85'%3E%3Cpath fill='%23444a54' d='M0,225.92a31.52,31.52,0,0,1,9.26-22.37L203.55,9.27A31.64,31.64,0,0,1,248.3,54L76.39,225.92,248.3,397.83a31.64,31.64,0,0,1-44.75,44.74L9.27,248.29A31.51,31.51,0,0,1,0,225.92Z'/%3E%3C/svg%3E");
            background-position: 7px center;
        }
        .${className}__arrow_right {
            margin-right: 85px;
            background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 451.846 451.847' xml:space='preserve'%3E%3Cpath fill='%23444a54' d='M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744 L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284 c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z'/%3E%3C/svg%3E");
            background-position: 10px center;
        }
    `;
  let style = document.createElement('style');
  style.append(document.createTextNode(styles));
  document.head.insertBefore(style, document.head.querySelector('link'));
  return { styles, className };
}
