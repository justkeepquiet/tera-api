// This script is a modified version of the project "Slider Captcha" (https://github.com/ArgoZhang/SliderCaptcha)
// Original code: Copyright (c) Argo Zhang <argo@163.com>
// License Apache-2.0 license is available on: http://www.apache.org/licenses/LICENSE-2.0

// CHANGES:
// The logic of working with images has been changed. Now the images are generated on the server, 
// and the client only renders these images. The slider display has been improved.

(function () {
    'use strict';

    var extend = function () {
        var length = arguments.length;
        var target = arguments[0] || {};

        if (typeof target != 'object' && typeof target != 'function') {
            target = {};
        }

        if (length == 1) {
            target = this;
            i--;
        }

        for (var i = 1; i < length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    }

    var isFunction = function isFunction(obj) {
        return typeof obj === 'function' && typeof obj.nodeType !== 'number';
    };

    var SliderCaptcha = function (element, options) {
        this.$element = element;
        this.options = extend({}, SliderCaptcha.DEFAULTS, options);

        this.init();
    };

    // This SVG Font is taken from the project "rc-slider-captcha" (https://github.com/caijf/rc-slider-captcha)
    // Original code: Copyright (c) 2022 caijf
    // License MIT License is available on: https://github.com/caijf/rc-slider-captcha/blob/main/LICENSE
    const iconRfresh = '<svg fill=currentColor height=1em viewBox="0 0 1024 1024" width=1em xmlns=http://www.w3.org/2000/svg><path d="M866.133333 573.013333a42.666667 42.666667 0 0 0-53.333333 27.733334A304.64 304.64 0 0 1 519.68 810.666667 302.933333 302.933333 0 0 1 213.333333 512a302.933333 302.933333 0 0 1 306.346667-298.666667 309.76 309.76 0 0 1 198.4 71.253334l-92.586667-15.36a42.666667 42.666667 0 0 0-49.066666 35.413333 42.666667 42.666667 0 0 0 35.413333 49.066667l180.906667 29.866666h7.253333a42.666667 42.666667 0 0 0 14.506667-2.56 14.08 14.08 0 0 0 4.266666-2.56 33.28 33.28 0 0 0 8.533334-4.693333l3.84-4.693333c0-2.133333 3.84-3.84 5.546666-6.4s0-4.266667 2.133334-5.973334a57.173333 57.173333 0 0 0 2.986666-7.68l32-170.666666a42.666667 42.666667 0 0 0-85.333333-16.213334l-11.52 61.866667A392.96 392.96 0 0 0 519.68 128 388.266667 388.266667 0 0 0 128 512a388.266667 388.266667 0 0 0 391.68 384A389.12 389.12 0 0 0 896 626.346667a42.666667 42.666667 0 0 0-29.866667-53.333334z"/></svg>';
    const iconRightArrow = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor"><path d="M116.9408 561.4592m0-40.96l0 0q0-40.96 40.96-40.96l573.44 0q40.96 0 40.96 40.96l0 0q0 40.96-40.96 40.96l-573.44 0q-40.96 0-40.96-40.96Z" /><path d="M769.82272 519.43424l-203.22304-203.22304a40.96 40.96 0 1 1 57.91744-57.91744l231.71072 231.71072a40.96 40.96 0 0 1 0.45056 58.44992L624.9472 780.12416a40.96 40.96 0 0 1-57.93792-57.91744l202.79296-202.79296z" /></svg>';
    const iconCheck = '<svg fill=currentColor height=1em viewBox="0 0 1024 1024" width=1em xmlns=http://www.w3.org/2000/svg><path d="M864.554667 268.501333a42.666667 42.666667 0 0 1 0 60.330667L412.032 781.397333a42.453333 42.453333 0 0 1-22.613333 11.818667l-5.034667 0.597333H379.306667a42.496 42.496 0 0 1-27.648-12.416l-211.2-211.2a42.666667 42.666667 0 1 1 60.330666-60.330666l180.992 180.992 422.4-422.4a42.666667 42.666667 0 0 1 60.330667 0z"/></svg>';
    const iconX = '<svg fill=currentColor height=1em viewBox="0 0 1024 1024" width=1em xmlns=http://www.w3.org/2000/svg><path d="M572.96896 524.6976l217.23136 217.25184a40.96 40.96 0 1 1-57.93792 57.91744L515.072 582.63552l-212.3776 212.3776a40.96 40.96 0 1 1-57.9584-57.91744l212.39808-212.3776-217.21088-217.23136a40.96 40.96 0 1 1 57.91744-57.91744l217.23136 217.21088L737.0752 244.736a40.96 40.96 0 1 1 57.93792 57.91744L572.96896 524.71808z"/></svg>';
    const iconLoading = '<svg height=1em viewBox="0 0 120 120" width=1em xmlns=http://www.w3.org/2000/svg><defs><line id=l stroke=currentColor stroke-linecap=round stroke-width=11 x1=60 x2=60 y1=7 y2=27 /></defs><g><use opacity=.27 xlink:href=#l /><use opacity=.27 xlink:href=#l transform="rotate(30 60,60)"/><use opacity=.27 xlink:href=#l transform="rotate(60 60,60)"/><use opacity=.27 xlink:href=#l transform="rotate(90 60,60)"/><use opacity=.27 xlink:href=#l transform="rotate(120 60,60)"/><use opacity=.27 xlink:href=#l transform="rotate(150 60,60)"/><use opacity=.37 xlink:href=#l transform="rotate(180 60,60)"/><use opacity=.46 xlink:href=#l transform="rotate(210 60,60)"/><use opacity=.56 xlink:href=#l transform="rotate(240 60,60)"/><use opacity=.66 xlink:href=#l transform="rotate(270 60,60)"/><use opacity=.75 xlink:href=#l transform="rotate(300 60,60)"/><use opacity=.85 xlink:href=#l transform="rotate(330 60,60)"/><animateTransform attributeName=transform dur=0.85s from="0 60 60" repeatCount=indefinite to="360 60 60" type=rotate /></g></svg>';

    SliderCaptcha.DEFAULTS = {
        modal: false,
        width: 360,
        height: 160,
        formText: 'I am human',
        loadingText: 'Loading...',
        barText: 'Slide To Verify',
        serverUrl: '/api/captcha'
    };

    function Plugin(option) {
        var $this = document.getElementById(option.id);
        var options = typeof option === 'object' && option;

        return new SliderCaptcha($this, options);
    }

    window.sliderCaptcha = Plugin;
    window.sliderCaptcha.Constructor = SliderCaptcha;

    var _proto = SliderCaptcha.prototype;

    _proto.init = function () {
        this.initDOM();
        this.bindEvents();
        this.initImg();
    };

    _proto.initDOM = function () {
        var createElement = function (tagName, className) {
            var elment = document.createElement(tagName);
            elment.className = className;
            return elment;
        };

        var createCanvas = function (width, height, className) {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.className = className;
            return canvas;
        };

        var checkboxIcon = createElement('div', 'sc-checkbox-icon');

        var placeholderContainer = createElement('div', 'sc-placeholder-container');
        var placeholderCheckbox = createElement('div', 'sc-placeholder-checkbox');
        var placeholderCaption = createElement('div', 'sc-placeholder-caption');
        var placeholderCopyright = createElement('div', 'sc-placeholder-copyright');
        var modalContainer = createElement('div', 'sc-modal-container hidden');

        var canvas = createCanvas(this.options.width, this.options.height, 'sc-canvas hidden');
        var block = createCanvas(this.options.width, this.options.height, 'sc-canvas-block hidden');
        var mask = createElement('div', 'sc-canvas-mask');
        var canvasContainer = createElement('div', 'sc-canvas-container');
        var loadingContainer = createElement('div', 'sc-loading-container');
        var loadingIcon = createElement('div', 'sc-loading-icon');
        var loadingText = createElement('div', 'sc-loading-text');
        var sliderContainer = createElement('div', 'sc-slider-container');
        var refreshIcon = createElement('span', 'sc-refresh-icon');
        var sliderMask = createElement('div', 'sc-slider-mask');
        var sliderBackground = createElement('div', 'sc-slider-background');
        var slider = createElement('div', 'sc-slider');
        var sliderIcon = createElement('i', 'sc-slider-icon');
        var text = createElement('span', 'sc-slider-text');

        var el = this.$element;

        loadingContainer.appendChild(loadingIcon);
        loadingContainer.appendChild(loadingText);
        canvasContainer.appendChild(loadingContainer);
        canvasContainer.appendChild(refreshIcon);
        canvasContainer.appendChild(canvas);
        canvasContainer.appendChild(block);
        canvasContainer.appendChild(mask);
        slider.appendChild(sliderIcon);
        sliderMask.appendChild(slider);
        sliderContainer.appendChild(sliderBackground);
        sliderContainer.appendChild(sliderMask);
        sliderContainer.appendChild(text);

        if (this.options.modal) {
            placeholderCaption.textContent = this.options.formText;
            modalContainer.style.width = (this.options.width + 12) + 'px';
            modalContainer.style.height = (this.options.height + 60) + 'px';
            placeholderCopyright.textContent = 'CAPTCHA';

            placeholderCheckbox.appendChild(checkboxIcon);
            modalContainer.appendChild(canvasContainer);
            modalContainer.appendChild(sliderContainer);
            placeholderContainer.appendChild(placeholderCheckbox);
            placeholderContainer.appendChild(placeholderCaption);
            placeholderContainer.appendChild(placeholderCopyright);
            el.appendChild(placeholderContainer);

            document.body.appendChild(modalContainer);
        } else {
            el.appendChild(canvasContainer);
            el.appendChild(sliderContainer);

            el.style.width = (this.options.width + 2) + 'px';
        }

        loadingIcon.innerHTML = iconLoading;
        loadingText.innerHTML = this.options.loadingText;
        loadingContainer.style.width = this.options.width + 'px';
        canvasContainer.style.width = this.options.width + 'px';
        canvasContainer.style.height = this.options.height + 'px';
        sliderContainer.style.width = (this.options.width + 2) + 'px';
        refreshIcon.innerHTML = iconRfresh;
        sliderIcon.innerHTML = iconRightArrow;

        var _canvas = {
            verified: false,
            modalVisible: false,
            sliderDisabled: true,
            placeholderContainer: placeholderContainer,
            placeholderCheckbox: placeholderCheckbox,
            checkboxIcon: checkboxIcon,
            modalContainer: modalContainer,
            canvas: canvas,
            block: block,
            mask: mask,
            sliderContainer: sliderContainer,
            refreshIcon: refreshIcon,
            loadingContainer: loadingContainer,
            slider: slider,
            sliderMask: sliderMask,
            sliderIcon: sliderIcon,
            text: text,
            canvasCtx: canvas.getContext('2d'),
            blockCtx: block.getContext('2d')
        };

        if (isFunction(Object.assign)) {
            Object.assign(this, _canvas);
        } else {
            extend(this, _canvas);
        }
    };

    _proto.fetchCaptcha = function() {
        this.sliderDisabled = true;

        try {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', this.options.serverUrl + '?w=' + this.options.width + '&h=' + this.options.height + '&ts=' + Date.now(), true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);

                        if (data.image && data.block) {
                            this.token = data.token;
                            this.renderCaptcha(data.image, data.block);
                        } else {
                            throw new Error('Invalid response from server');
                        }
                    } else {
                        throw new Error('Request failed with status: ' + xhr.status);
                    }
                }
            }.bind(this);

            xhr.send();
        } catch (error) {
            console.error('Failed to load images:', error);
            this.text.textContent = 'Failed to load captcha. Try again!';
        }
    };

    _proto.initImg = function () {
        if (!this.options.modal) {
            this.reset(true);
        }
    };

    _proto.renderCaptcha = function (imageSrc, blockSrc) {
        var that = this;
        var img = new Image();
        var blockImg = new Image();

        img.onload = function () {
            that.canvasCtx.drawImage(img, 0, 0, that.options.width, that.options.height);
            blockImg.src = blockSrc;
        };

        blockImg.onload = function () {
            that.blockCtx.drawImage(blockImg, 0, -1, that.options.width, that.options.height);
            that.setSliderReady();
        };

        img.src = imageSrc;
    };

    _proto.clean = function () {
        this.block.width = this.options.width;
    };

    _proto.bindEvents = function () {
        var that = this;

        this.$element.addEventListener('selectstart', function () {
            return false;
        });

        this.placeholderContainer.addEventListener('click', function (e) {
            e.stopPropagation();

            if (!that.verified) {
                that.modalOpen();
            }
        });

        this.refreshIcon.addEventListener('click', function () {
            if (that.sliderDisabled) return false;

            that.reset(true);

            if (isFunction(that.options.onRefresh)) {
                that.options.onRefresh.call(that.$element);
            }
        });

        var originX, originY, trail = [], isMouseDown = false;

        var handleDragStart = function (e) {
            if (isMouseDown || that.sliderDisabled || e.button != 0) return false;

            isMouseDown = true;

            if (!that.text.classList.contains('text-danger')) {
                originX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
                originY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            }
        };

        var handleDragMove = function (e) {
            if (!isMouseDown || that.sliderDisabled) return false;

            var eventX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
            var eventY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            var moveX = eventX - originX;
            var moveY = eventY - originY;
            var moveLeft = Math.max(0, Math.min(that.options.width - 40 + 2, moveX));
            var blockLeft = (that.options.width - 40 - 20) / (that.options.width - 40) * moveLeft;

            that.slider.style.left = (moveLeft - 1) + 'px';
            that.block.style.left = blockLeft + 'px';
            that.sliderMask.style.width = (moveLeft + 40 - 2) + 'px';

            trail.push(Math.round(moveY));
            that.setSliderActive();
        };

        var handleDragEnd = function (e) {
            if (!isMouseDown || that.sliderDisabled) return false;

            isMouseDown = false;

            var eventX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : 0);
            if (eventX === originX) return false;

            that.trail = trail;
            that.verify();
        };

        this.slider.addEventListener('mousedown', handleDragStart);
        this.mask.addEventListener('mousedown', handleDragStart);

        this.slider.addEventListener('touchstart', function (e) {
            handleDragStart(e);
        });
        this.mask.addEventListener('touchstart', function (e) {
            handleDragStart(e);
        });

        this.mask.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('touchend', handleDragEnd);
    };

    _proto.verify = function () {
        var that = this;
        that.setSliderWait();

        try {
            var answer = parseInt(that.block.style.left);
            var xhr = new XMLHttpRequest();

            xhr.open('POST', that.options.serverUrl + '?ts=' + Date.now(), true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);

                        if (data.verified) {
                            that.trail = [];
                            that.setSliderSuccess();

                            that.placeholderCheckbox.innerHTML = iconCheck;

                            if (isFunction(that.options.onSuccess)) {
                                that.options.onSuccess.call(that.$element);
                            }

                            if (that.options.modal) {
                                setTimeout(function () {
                                    that.modalClose();
                                }, 500);
                            }

                            that.verified = true;
                        } else {
                            that.setSliderFailed();

                            if (isFunction(that.options.onFail)) {
                                that.options.onFail.call(that.$element);
                            }

                            setTimeout(function () {
                                that.reset(true);
                            }, 1000);

                            that.verified = false;
                        }
                    } else {
                        throw new Error('Request failed with status: ' + xhr.status);
                    }
                }
            };
            var payload = {
                token: that.token,
                answer: answer
            };

            xhr.send(JSON.stringify(payload));
        } catch (error) {
            console.error('Failed to verify captcha:', error);
            this.text.textContent = 'Failed to verify captcha. Try again!';
        }

        that.slider.style.cursor = '';
    };

    _proto.reset = function (fetch) {
        this.canvas.classList.remove('visible');
        this.canvas.classList.add('hidden');
        this.block.classList.remove('visible');
        this.block.classList.add('hidden');

        this.block.style.left = 0;
        this.mask.style.left = 0;

        this.loadingContainer.classList.remove('sc-loading-container-disabled');

        if (fetch && (!this.options.modal || this.modalVisible)) {
            this.refreshIcon.style.display = 'none';
            this.slider.style.left = 0;
            this.sliderMask.style.width = 0;

            this.clearSliderClass();
            this.fetchCaptcha();
        }

        this.clean();
    };

    _proto.setSliderReady = function () {
        this.setSliderClass('sc-slider-container-ready');

        this.sliderDisabled = false;

        this.canvas.classList.remove('hidden');
        this.canvas.classList.add('visible');
        this.block.classList.remove('hidden');
        this.block.classList.add('visible');

        this.refreshIcon.style.display = 'block';
        this.block.style.cursor = 'auto';
        this.text.textContent = this.options.barText;

        this.loadingContainer.classList.add('sc-loading-container-disabled');
    };

    _proto.setSliderActive = function () {
        this.setSliderClass('sc-slider-container-active');
    };

    _proto.setSliderWait = function () {
        this.sliderDisabled = true;
        this.sliderIcon.innerHTML = iconLoading;
        this.slider.style.cursor = 'wait';
        this.refreshIcon.style.display = 'none';
        this.block.style.cursor = '';
    }

    _proto.setSliderSuccess = function () {
        this.setSliderClass('sc-slider-container-success');

        this.sliderDisabled = true;
        this.refreshIcon.style.display = 'none';
        this.sliderIcon.innerHTML = iconCheck;
        this.block.style.cursor = '';
    };

    _proto.setSliderFailed = function () {
        this.setSliderClass('sc-slider-container-fail');

        this.sliderIcon.innerHTML = iconX;
        this.block.style.cursor = '';
    };

    _proto.clearSliderClass = function () {
        if (!this.sliderContainer) return;

        this.sliderContainer.classList.remove('sc-slider-container-ready');
        this.sliderContainer.classList.remove('sc-slider-container-success');
        this.sliderContainer.classList.remove('sc-slider-container-fail');
        this.sliderContainer.classList.remove('sc-slider-container-active');
        this.sliderIcon.innerHTML = iconRightArrow;
    };

    _proto.setSliderClass = function (className) {
        if (!this.sliderContainer) return;

        this.clearSliderClass();
        this.sliderContainer.classList.add(className);
    };

    _proto.modalOpen = function () {
        this.modalVisible = true;

        this.reset(true);

        this.modalContainer.classList.remove('hidden');
        this.modalContainer.classList.add('visible');

        this.updateModalPosition();

        document.addEventListener('click', this.handleModalCloseClick.bind(this));
        window.addEventListener('scroll', this.updateModalPosition.bind(this));
        window.addEventListener('resize', this.updateModalPosition.bind(this));
    };

    _proto.modalClose = function () {
        this.reset(false);

        this.modalVisible = false;

        this.modalContainer.classList.remove('visible');
        this.modalContainer.classList.add('hidden');

        document.removeEventListener('click', this.handleModalCloseClick.bind(this));
        window.removeEventListener('scroll', this.updateModalPosition.bind(this));
        window.removeEventListener('resize', this.updateModalPosition.bind(this));
    };

    _proto.updateModalPosition  = function () {
        var placeholderRect = this.placeholderContainer.getBoundingClientRect();
        var modalWidth = parseInt(this.modalContainer.style.width);
        var modalHeight = parseInt(this.modalContainer.style.height);

        var leftPosition = placeholderRect.left + (placeholderRect.width / 2) - (modalWidth / 2);
        var topPosition = placeholderRect.top + (placeholderRect.height / 2) - (modalHeight / 2);

        if (leftPosition < 0) {
            leftPosition = 0;
        }

        if (topPosition < 0) {
            topPosition = 0;
        } else if (topPosition + modalHeight > window.innerHeight) {
            topPosition = window.innerHeight - modalHeight;
        }

        this.modalContainer.style.left = (leftPosition - 1) + 'px';
        this.modalContainer.style.top = (topPosition - 1) + 'px';
    };

    _proto.handleModalCloseClick = function (e) {
        e.stopPropagation();

        if (!this.modalContainer.contains(e.target)) {
            this.modalClose();
        }
    };
})();