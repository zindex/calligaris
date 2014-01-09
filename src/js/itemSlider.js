'use strict';

var sliderModule = (function(){
    var Slider = {
        currentRow: 0,
        rows: 0,
        rowHeight: 0,
        isAnimated: false,
        scrollDisabled: false,
		bodyScrollReset: true,
        auto: false,
        autoInterval: false,
        support: Modernizr.cssanimations,
        wrap: $('jsWrap'),
        control: $('.jsControl'),
        controlTop: $('.control__button_top'),
        controlBottom: $('.control__button_bottom'),
        controlCount: $('.control__count'),
		linkImage: $('.jsLinkImg'),
        getElements: function(wrap, control){
            this.wrap = wrap || $('.jsWrap');
            this.control = control || $('.jsControl');
            this.controlTop = $('.control__button_top', this.control);
            this.controlBottom = $('.control__button_bottom', this.control);
            this.controlCount = $('.control__count', this.control);
			this.linkImage = $('.jsLinkImg', this.control);
			this.marks = $('.jsMark', this.wrap);
        },
        animateToSlide: function(slideNum){
            var self = this;

            if (self.bodyScrollReset){
                $('html, body').animate({
                    scrollTop: 0
                }, 300);
            }

            if (self.support){
                self.wrap.css({
                    top: slideNum || self.currentRow * -self.rowHeight
                }).transitionEnd(callBack);
            } else {
                self.wrap.animate({
                    top: slideNum || self.currentRow * -self.rowHeight
                }, 600, callBack);
            }

            this.updateStatus();

            if (typeof self.onAnimation === 'function'){
                self.onAnimation();
            }

            function callBack(){
                self.controlTop.add(self.controlBottom).removeClass('is-active');
                self.isAnimated = false;
            }
        },
        onAnimation: function(){


        },
        updateStatus: function(){
            // count update
            this.controlCount.text((this.currentRow + 1) + '/' + (this.rows + 1));

            // painting buttons
            this.controlTop.add(this.controlBottom).removeClass('is-disabled');

            if (this.currentRow === 0){
                this.controlTop.addClass('is-disabled');
            }

            if (this.currentRow === this.rows){
                this.controlBottom.addClass('is-disabled');
            }
        },
        updateSize: function(){

        },
        attachEvents: function(){
            var self = this;

            self.controlTop.on({
                click: function(e){
                    if ($(this).is('.is-disabled')) { return; }
                    scrollTop();

                    e.preventDefault();
                }
            });

            self.controlBottom.on({
                click: function(e){
                    if ($(this).is('.is-disabled')) { return; }
                    scrollBottom();

                    e.preventDefault();
                }
            });

			self.linkImage.on({
				click: function(e){
					if ($(this).is('.is-disabled')) { return; }
					scrollBottom();
					alert(1);

					e.preventDefault();
				}
			});

            self.marks.each(function(){
                if (!self.auto) { return }

                $(this).on({
                    mouseenter: function(){
                        self.auto = false;
                        self.resetAuto();
                    },
                    mouseleave: function(){
                        self.auto = true;
                        self.resetAuto();
                    }
                });
            });

			$(window).on({
				resize: function(){
					self.updateSize();
				}
			});

//            $(document).on({
//                mousewheel: function(event, delta, deltaX, deltaY) {
//                    if (self.scrollDisabled) { return; }
//
//                    // requires jquery.mousewheel plugin
//                    if (delta < 0){
//                        scrollBottom();
//                    }
//                    if (delta > 0){
//                        scrollTop();
//                    }
//                }
//            }).swipe({
//                swipe:function(event, direction, distance, duration, fingerCount) {
//                    if (direction === 'down'){
//                        scrollTop();
//                    }
//                    if (direction === 'up'){
//                        scrollBottom();
//                    }
//                },
//                threshold: 0
//            });

            function scrollTop(){
                if (self.currentRow > 0){
                    if (self.isAnimated){ return;}
                    self.isAnimated = true;

                    self.controlTop.addClass('is-active');
                    self.currentRow--;
                    self.animateToSlide();
                    self.resetAuto();
                }
            }

            function scrollBottom(){
                if (self.currentRow < self.rows){
                    if (self.isAnimated){ return;}
                    self.isAnimated = true;

                    self.controlBottom.addClass('is-active');
                    self.currentRow++;
                    self.animateToSlide();
                    self.resetAuto();
                }
            }
        },
        autoSlide: function(){
            var self = this;

            self.autoInterval = setTimeout(function(){
                self.currentRow++;
                if (self.currentRow > self.rows){ self.currentRow = 0; }
                self.animateToSlide();

                self.autoSlide();
            }, 5000);

        },
        resetAuto: function(){
            clearInterval(this.autoInterval);
            if (this.auto){ this.autoSlide();}
        }
    };

    // product slider
    function ItemSliderClass(elem) {
        var self = this,
            prodList = elem,
            wrap = $('.prod-list__inner', prodList),
            items = $('.prod', prodList).clone(),
            itemWidth = 190,
            itemHeight = 219;

        // properties
        this.countInRow = 16;
        //this.ftr = $('.ftr').wrap('<div class="prod-list__field"></div>').parent().remove();

        // methods
        this.drawGrid = function(){
            wrap.html('');

            for (var i = 0; i <= this.rows; i++){
                var rowData = $('<div class="prod-list__field"></div>');
                rowData.append(items.slice(i * self.countInRow,(i + 1) * self.countInRow));

                wrap.append(rowData);
            }

            //wrap.append(self.ftr);
            //self.rows++;

            self.updateStatus();
        };

        this.updateCount = function(){
            self.rows = Math.ceil(items.length / self.countInRow) - 1;
        };
        this.onAnimation = function(){
//            if (self.rows === self.currentRow){
//                prodList.css('height', self.ftr.height());
//                self.scrollDisabled = true;
//            } else {
//                prodList.css('height', self.rowHeight);
//                self.scrollDisabled = false;
//            }
        };
        this.updateSize = function(){
            prodList.css('height', 'auto');
            wrap.css('top', 0);
            self.currentRow = 0;
            self.scrollDisabled = false;

            var topPos = prodList.offset().top,
                bottomPos = $(window).height() - topPos <= 470 ? 470 : $(window).height() - topPos,
                itemsByX = Math.floor(wrap.width() / itemWidth),
                itemsByY = Math.floor((bottomPos) / itemHeight),
				prodWrap = $('.prod-list-i');

            self.countInRow = itemsByX * itemsByY;
//			if ($(window).height() >= 540){
//				prodWrap.css('height',$(window).height() - topPos + 85);
//			} else {
//				prodWrap.css('height',540);
//			}

            self.updateCount();
            self.drawGrid();

            self.rowHeight = $('.prod-list__field', prodList).first().height();
            prodList.css('height', self.rowHeight);
        };

        this.init = function(){
            self.getElements(wrap, $('.jsControl'));
            self.updateSize();
            self.updateStatus();
            self.animateToSlide();

            self.attachEvents();
        };

        self.init();
    }

    function MainSliderClass(elem) {
        var self = this,
            design = elem,
            wrap = $('.jsWrap', design),
            items = $('.design__item ', design),
            promoBlock = $('.jsPromo ', design),
            sidebarOpener = $('.jsOpenDesignSidebar', design),
            sidebarOpenerLeft = $('.jsOpenDesignSidebarLeft', design),
            firstRun = true;

        self.bodyScrollReset = false;
        self.auto = true;

        this.initSidebarOpener = function(){
            var self = this;

            sidebarOpener.on({
                click: function(e){
                    design.toggleClass('is-sidebar-opened');
					design.removeClass('is-sidebar-opened-left');
                    self.auto = !self.auto;
                    self.resetAuto();

                    e.preventDefault();
                }
            });
            sidebarOpenerLeft.on({
                click: function(e){
                    design.toggleClass('is-sidebar-opened-left');
					design.removeClass('is-sidebar-opened');
                    self.auto = !self.auto;
                    self.resetAuto();

                    e.preventDefault();
                }
            });

			$('.prod').on({
				click: function(e){
//					design.toggleClass('is-sidebar-opened-left');
					design.removeClass('is-sidebar-opened');
					self.auto = !self.auto;
					self.resetAuto();

					e.preventDefault();
				}
			});

			$('.design-list__img-inner').on({
				click: function(e){
					design.toggleClass('is-sidebar-opened-left');
					design.removeClass('is-sidebar-opened');
					self.auto = !self.auto;
					self.resetAuto();

					e.preventDefault();
				}
			});
        };

        this.updateSize = function(){
            self.rows = items.length - 1;
            self.rowHeight = items.eq(0).height();
            if (firstRun){ self.rowHeight = $(window).height(); }

            wrap.css('top', self.rowHeight * -self.currentRow);
			design.css('height', self.rowHeight); /* will commented*/
            items.css('height', self.rowHeight);

        };
        this.onAnimation = function(){
//            if (self.currentRow === self.rows) {
//                promoBlock.hide();
//            } else {
//                setTimeout(function(){
//                    promoBlock.show();
//                }, 600);
//            }
        };
        this.alignImages = function(){
            align();
            $(window).on({
                'load resize focus': function(){
                    align();
                }
            });

            function align(){
                var windowHeight = $(window).height(),
                    windowWidth = $(window).width(),
                    zoomIndex = 1;

                setTimeout(function(){
                    self.updateSize();
                }, 0);

                items.each(function(i, v){
                    var bgWrap = $('.design__bg-i', v),
                        bg = $('.design__bg', v),
                        marks = $('.mark', v);

                    if (bg.length === 0){ return; }

                    bg.add(bgWrap).css({
                        'top': 0,
                        'left': 0,
                        'height': 'auto',
                        'width': 'auto'
                    });

                    setTimeout(function(){

                        // image's width and height are bigger than window's ones
                        if (bg.width() > windowWidth && bg.height() > windowHeight){
                            bgWrap.css({
                                'height': bg.height(),
                                'width': bg.width(),
                                'top': -(bg.height()-windowHeight)/2 + 'px',
                                'left': -(bg.width()-windowWidth)/2 + 'px'
                            });
                        }

                        // image's width is bigger than window's one, but height is smaller
                        if (bg.width() > windowWidth && bg.height() < windowHeight){
                            bg.css({
                                'height': '100%',
                                'width': 'auto'
                            });
                            bgWrap.css({
                                'height': '100%',
                                'width': bg.width(),
                                'top': 0,
                                'left': -(bg.width()-windowWidth)/2 + 'px'
                            });
                        }

                        // image's width is smaller than window's one, but height is bigger
                        if (bg.width() < windowWidth && bg.height() > windowHeight){
                            bg.css({
                                'height': 'auto',
                                'width': '100%'
                            });
                            bgWrap.css({
                                'height': bg.height(),
                                'width': '100%',
                                'top': -(bg.height()-windowHeight)/2 + 'px',
                                'left': 0
                            });
                        }

                        // image's width and height are smaller than window's ones
                        if (bg.width() < windowWidth && bg.height() < windowHeight){
                            bg.css({
                                'height': '100%',
                                'width': '100%'
                            });
                        }

                    }, 0);
                });
            }
        };
        this.init = function(){
            self.getElements(wrap, $('.jsControl'));
            self.initSidebarOpener();
            self.updateSize();
            self.updateStatus();
            self.alignImages();
            self.animateToSlide();
            self.autoSlide();

            self.attachEvents();
        };

        self.init();
    }

    ItemSliderClass.prototype = Slider;
    MainSliderClass.prototype = Slider;

    $(function(){
        if ($('.jsProdList').length !== 0){
            var itemSlider = new ItemSliderClass($('.jsProdList'));
        }
        if ($('.jsMainSlider').length !== 0){
            var mainSlider = new MainSliderClass($('.jsMainSlider'));
        }
    });

})();