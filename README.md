# axialslider

Simple slider with two axes and buttons

## Installation

    npm i axialslider

## Usage

```javascript
import axialslider from 'axialslider';

window.addEventListener('load', function () {
    axialslider({
      class: 'yourclass', // CSS class name, default: axialslider
      color: '#19bd9a' // Also you can use rgba
    });
});
```

Cross browser way provedes requestAnimationFrame:

```javascript
if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
      window.setTimeout( callback, 1000 / 60 );
    };
  } )();
}
```

```html
<div class="yourclass">
  <div class="yourclass__slides">
    <div class="yourclass__slide">
      My Slide 1
    </div>
    <div class="yourclass__slide">
      My Slide 2
    </div>
  </div>
</div>
```

For vertical slider:
```html
<div class="yourclass yourclass_vertical">
  <div class="yourclass__slides">
    <div class="yourclass__slide">
      My Slide 1
    </div>
    <div class="yourclass__slide">
      My Slide 2
    </div>
  </div>
</div>
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
