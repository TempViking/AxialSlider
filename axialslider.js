/*
 * @param {Object} props Consider slider preferences
 * @param {Object} props.class CSS class name
 * @param {Object} props.color Buttons color
 * @param {Object} props.duration Time of execution
 * @param {Object} props.delay Delay time between slides
 */
export default function initSlider(props = false) {
    window.sliders_array = [];
    let { className } = setStyles(props);
    window.nextSlideDuration = props && props.duration ? props.duration : 1000;
    window.nextSlideDelay = props && props.delay ? props.delay : 3000;
    const sliders = document.querySelectorAll(`.${className}`);
    for (let i = 0; i < sliders.length; i++) {
        const buttons = document.createElement('div');
        buttons.className = `${className}__buttons`;
        sliders[i].appendChild(buttons);
        window.sliders_array.push({
            width: sliders[i].querySelector(`.${className}__slides`).offsetWidth,
            height: sliders[i].querySelector(`.${className}__slides > .${className}__slide`).offsetHeight,
            vertical: sliders[i].classList.contains(`${className}_vertical`),
            amount: sliders[i].querySelector(`.${className}__slides`).children.length - 1,
            current: 0,
            interval: null,
            slides: sliders[i].querySelector(`.${className}__slides`),
            buttons: sliders[i].querySelector(`.${className}__buttons`),
            className
        });
        sliders[i].querySelector(`.${className}__slides`).style.height = window.sliders_array[i].height + 'px';
        for (let a = 0; a < window.sliders_array[i].amount + 1; a++) {
            const button = document.createElement('div');
            button.className = `${className}__button` + (a === 0 ? ` ${className}__button_active` : '');
            button.addEventListener('click', () => {
                clearTimeout(window.sliders_array[i].interval);
                window.sliders_array[i].interval = null;
                nextSlide(i, a);
            });
            window.sliders_array[i].buttons.appendChild(button);
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
    let {className, width, height, vertical, slides, amount, current, buttons, interval} = window.sliders_array[n];
    const scroll_start = vertical ? slides.scrollTop : slides.scrollLeft;
    next = next > -1 ? next : current === amount ? 0 : current + 1;
    buttons.querySelector(`.${className}__button_active`).classList.remove(`${className}__button_active`);
    buttons.children[next].classList.add(`${className}__button_active`);
    window.sliders_array[n].current = next;
    let start_offset = scroll_start - (vertical ? height : width) * current;
    await new Promise(resolve => {
        window.requestAnimationFrame(function animate(time) {
            let timeFraction = (time - time_start) / window.nextSlideDuration;
            if (timeFraction > 1) timeFraction = 1;

            if (vertical) {
                slides.scrollTo(0, scroll_start + (next - current === 0 ? 1 : next - current) * (height + start_offset) * timeFraction);
            } else {
                slides.scrollTo(scroll_start + (next - current === 0 ? 1 : next - current) * (width + start_offset) * timeFraction, 0);
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
    let className = props && props.class !== undefined ? props.class : 'axialslider';
    let color = props && props.color !== undefined ? props.color : '#19bd9a';
    let styles = `
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
    `;
    let style = document.createElement('style');
    style.append(document.createTextNode(styles));
    document.head.insertBefore(style, document.head.querySelector('link'));
    return { styles, className };
}
