'use strict';

var mainJs = new MainJsClass();

function MainJsClass() {
    var scope = this;

    this.commonFeatures = function () {
        var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
        if (isMac){
            $('html').addClass('is-mac');
        }
		if ($.browser.opera && parseInt($.browser.version, 10) <= 12) {
			$('html').addClass('opera12');
		}




        // mark description
        $('.jsMark').each(function(){
            var that = $(this),
                markBody = $('.mark__body', that),
                markTimeout;

            that.on({
                mouseenter: function(){
                    clearTimeout(markTimeout);

                    // align to bottom if enough space
                    if (($(window).height() - that.offset().top) > 337){
                        that.addClass('mark_top');
                    }

                    // align to bottom if not enough space
                    if (($(window).width() - that.offset().left - 35) < 242){
                        that.addClass('mark_left');
                    }
                    $(this).addClass('is-hover');

                },
                mouseleave: function(){
                    markTimeout = setTimeout(function(){
                        that.removeClass('is-hover mark_top mark_left');
                    }, 300);
                }
            });
        });

        // custom form elements
        if ($('input.checkbox').length !== 0){
            $('input.checkbox').iCheck({
                checkboxClass: 'icheckbox',
                radioClass: 'iradio'
            });
        }

        if ($('.jsChosen').length !== 0){
            $('.jsChosen').chosen({
                disable_search: true,
                inherit_select_classes: true
            });
        }

        // scrollpane
        $('.scroll-pane').jScrollPane({
            mouseWheelSpeed: 25,
            verticalDragMinHeight: 41,
            verticalDragMaxHeight: 41,
            horizontalDragMinWidth: 9,
            horizontalDragMaxWidth: 9,
            verticalGutter: 30,
            autoReinitialise: true
        });

        // forgot password block
        $('.jsPassLink').on({
            click: function(e){
                $(this).parent().hide();
                $('.jsPassBlock').show();

                e.preventDefault();
            }
        });

		$('.jsRestoreLink').on({
			click: function(e){
				$(this).hide();
				$('.jsRestoreBlock').show();

				e.preventDefault();
			}
		});

		$('.jsEditPersonLink').on({
			click: function(e){
				var $parent = $(this).parent('.info__edit'),
					$parentPerson = $("#jsPersonInfo .info__current");
					$parent.next('.info__edit-expand').slideToggle();
					$parentPerson.slideToggle();
				e.preventDefault();
			}
		});

		$('.jsEditPersonClose').on({
			click: function(e){
				var $parent = $(this).parents('.info__edit-expand'),
					$parentPerson = $("#jsPersonInfo .info__current");
					$parent.slideToggle();
					$parentPerson.slideToggle();

				e.preventDefault();
			}
		});

		$('.jsEditDeliveryLink').on({
			click: function(e){
				var $parent = $(this).parent('.info__edit'),
					$parentPerson = $("#jsDeliveryInfo .info__current");
					$parent.next('.info__edit-expand').slideToggle();
					$parentPerson.slideToggle();
				e.preventDefault();
			}
		});

		$('.jsEditDeliveryClose').on({
			click: function(e){
				var $parent = $(this).parents('.info__edit-expand'),
					$parentPerson = $("#jsDeliveryInfo .info__current");
					$parent.slideToggle();
					$parentPerson.slideToggle();

				e.preventDefault();
			}
		});

		$('.jsPassBlockClose').on({
			click: function(e){
				var $passBlock = $('.jsPassBlock');
				if($passBlock.is(':visible') ){
					$passBlock.hide();
					$('.jsPassLink').parent().show();
				}
			}
		});


    };
    this.mainGallery = function () {
        if($('.jsGallery').length > 0){

            $('.jsGallery').each(function(i,v){
                var gallery = $(this),
                    items = $('.gallery__item', gallery),
                    next = gallery.parent().siblings('.gallery__next'),
                    prev = gallery.parent().siblings('.gallery__prev');

                gallery.carouFredSel({
                    onCreate: function(){

                    },
                    scroll: {
                        items: 5,
                        fx: "scroll",
                        easing: "swing",
                        duration: 700,
                        onBefore: function (data) {

                        },
                        onAfter: function(data){

                        }
                    },
                    swipe: {
                        onTouch: true,
                        onMouse: true
                    },
                    align: 'center',
                    circular: false,
                    infinite: false,
                    responsive: true,
                    auto: false,
                    height: null,
                    width: '100%',
                    prev: prev,
                    next: next,
                    items: {
                        width: 213,
						height:200,
                        visible: {
                            min: 3,
                            max: 7
                        }
                    }
                }, {
                    classnames: {
                        disabled: 'is-disabled'
                    }
                });
            });
        }
    };
    this.searchBlock = function(){
        var searchLink = $('.jsShowSearch'),
            searchBlock = $('.menu__search'),
            input = $('.input', searchBlock),
			dropDowns = $('.menu__dropdown'),
            body = $('body');

        searchLink.on({
            click: function(e){
                searchBlock.css('left', searchLink.parents('.menu__list_controls').position().left);
                if ((searchBlock.offset().left + searchBlock.width() > $(window).width())){
                    searchBlock.css({
                        'left': 'auto',
                        'right': 0
                    });
                }

				dropDowns.hide();
                body.removeClass('is-cart-open');
				body.removeClass('is-menu-open');
                body.addClass('is-search-open');
                input.focus();

                e.stopPropagation();
                e.preventDefault();
            }
        });

        searchBlock.on({
            click: function(e){
                e.stopPropagation();
            }
        });

        body.on({
            click: function(e){
                body.removeClass('is-search-open');
            }
        });
    };
    this.cartBlock = function(){
        var cartLink = $('.jsShowCart'),
            cartBlock = $('.menu__cart'),
            close = $('.close', cartBlock),
			dropDowns = $('.menu__dropdown'),
            body = $('body');

        cartLink.on({
            click: function(e){
                body.removeClass('is-search-open');
                body.addClass('is-cart-open');
				dropDowns.hide();

                e.stopPropagation();
                e.preventDefault();
            }
        });

        cartBlock.on({
            click: function(e){
                e.stopPropagation();
            }
        });

        close.on({
            click: function(e){
                hideCart();

                e.preventDefault();
            }
        });

        body.on({click: hideCart});

        function hideCart(){
            body.removeClass('is-cart-open');
        }
    };

    this.menuDropdown = function(){
        var menuLink = $('.jsShowMenu'),
            dropDowns = $('.menu__dropdown'),
            body = $('body'),
            isHover = false,
            t1;


			if( navigator.userAgent.match(/Android/i)
				|| navigator.userAgent.match(/webOS/i)
				|| navigator.userAgent.match(/iPhone/i)
				|| navigator.userAgent.match(/iPad/i)
				|| navigator.userAgent.match(/iPod/i)
				|| navigator.userAgent.match(/BlackBerry/i)
				|| navigator.userAgent.match(/Windows Phone/i)
				){
				menuLink.on({
					click:function(e){
						body.toggleClass('is-menu-open');
						dropDowns.fadeToggle(1);
						scope.updateGallery();
						e.preventDefault();
					}
				});
				return true;
			} else {
				menuLink.on({
					mouseenter: function(e){
                        clearTimeout(t1);
//                $($(this).attr('href')).stop().show().animate({
//                    opacity: 1
//                }, 300);
						$($(this).attr('data-dropdown')).show();
						body.addClass('is-menu-open');

						scope.updateGallery();
					},
					mouseleave: function(e){
						setTimeout(function(){
							hideMenus();
						}, 0);
					}
				});

				dropDowns.on({
					mouseenter: function(e){
						isHover = true;
						e.preventDefault();
					},
					mouseleave: function(){
						isHover = false;
						hideMenus();
					}
				});
				return false;
			}


        function hideMenus(){
            if (!isHover){
                t1 = setTimeout(function(){
//                    dropDowns.stop().animate({
//                        opacity: 0
//                    }, 300, function(){
//                        setTimeout(function(){
//                            dropDowns.hide();
//                        }, 200);
//                    });

                    body.removeClass('is-menu-open').afterTransition(function(){
                        dropDowns.hide();
                    });
                }, 500);
            }
        }
    };
    this.cloudZoom = function(){
        if ($('.cloud-zoom').length !== 0){
            var cloudMain = $('.jsCloudMain'),
                cloudThumbs = $('.jsCloudThumbs .prod-gallery__item'),
                cloudZoom = $('.cloud-zoom'),
                cloudToggle = $('.jsCloudZoomToggle'),
                gallery = $('.jsPopupGallery'),
                next = gallery.siblings('.gallery__next'),
                prev = gallery.siblings('.gallery__prev'),
                popup = $('.popup_gallery'),
                popupClose = $('.close', popup);

            cloudZoom.CloudZoom();

            cloudThumbs.on({
                click: function(e){
                    var href = $(this).attr('href'),
                        src = $('img',this).attr('src');

                    cloudThumbs.removeClass('is-active');
                    $(this).addClass('is-active');

                    cloudMain.attr('href', href);
                    $('img',cloudMain).attr('src', src);

                    cloudZoom.parent('.could-zoom-wrap');
                    cloudZoom.CloudZoom();

                    e.preventDefault();
                }
            });

            cloudMain.on({
                mouseleave: function(e){
                     cloudToggle.removeClass('is-active');
                }
            });

            cloudToggle.on({
                'click touchend': function(e){
                    popup.show();
					cloudThumbs.hide();


                    if (gallery.parent().is('.caroufredsel_wrapper')){
                        gallery.trigger('destroy');
                    }

                    gallery.carouFredSel({
                        onCreate: function(){

                        },
                        scroll: {
                            items: 1,
                            fx: "scroll",
                            easing: "swing",
                            duration: 300,
                            onBefore: function (data) {

                            },
                            onAfter: function(data){

                            }
                        },
                        swipe: {
                            onTouch: true,
                            onMouse: true
                        },
                        align: 'center',
                        circular: false,
                        infinite: false,
                        responsive: false,
                        auto: false,
                        height: null,
                        width: '100%',
                        prev: prev,
                        next: next,
                        items: {
                            width: '100%',
                            visible: 1
                        }
                    }, {
                        classnames: {
                            disabled: 'is-disabled'
                        }
                    });

                    e.preventDefault();
                }
            });

            popupClose.on({
                click: function(e){
                    popup.hide();
					cloudThumbs.show();

                    e.preventDefault();
                }
            });
        }
    };
    this.initTabs = function () {
        var tabs = $('.jsTab'),
            tabsContent = $('.jsTabContent');

        tabs.on({
            click: function(e){
                var self = $(this);

                tabs.removeClass('is-active');
                $(this).addClass('is-active');

                tabsContent.hide();
                $(self.attr('href')).show();

                e.preventDefault();
            }
        });

        tabs.filter(function(){
            return $(this).is('.is-active');
        }).click();

    };
    this.singleGallery = function () {
        var gallery = $('.jsSingleGallery'),
            items = $('img', gallery),
            control = gallery.siblings('.jsControl'),
            next = $('.control__button_right', control),
            prev = $('.control__button_left', control),
            controlText = $('.control__count', control);

        gallery.carouFredSel({
            onCreate: function(){
                updateGalleryPos();
            },
            scroll: {
                items: 1,
                fx: "scroll",
                easing: "swing",
                duration: 300,
                onBefore: function (data) {
                    updateGalleryPos();
                },
                onAfter: function(data){

                }
            },
            swipe: {
                onTouch: true,
                onMouse: true
            },
            align: 'center',
            circular: false,
            infinite: false,
            responsive: false,
            auto: false,
            height: null,
            width: '100%',
            prev: prev,
            next: next,
            items: {
                height: '100%',
                visible: 1
            }
        }, {
            classnames: {
                disabled: 'is-disabled'
            }
        });

        $(window).load(function(){
            scope.updateGallery();
        });

        function updateGalleryPos(){
            gallery.trigger("currentPosition", function( pos ) {
                controlText.text((pos+1) + "/" + $("> *", this).length);
            });
        }
    };
    this.coverTooltip = function () {
        var tooltip = $('.jsCover');

        tooltip.on({
            mouseenter: function(e){
                $('.cover__txt', this).show();
            },
            mouseleave: function(e){
                $('.cover__txt', this).hide();
            }
        });
    };

    // helper methods
    this.updateGallery = function(){
         $('.jsGallery, .jsSingleGallery').trigger('updateSizes');
    };

	this.menuOpener = function(){
		if ($('.jsMenuOpener').length !== 0){
			var $opener = $('.jsMenuOpener'),
				body = $('body'),
				dropDowns = $('.menu__dropdown');
			$opener.click(function(){
				body.toggleClass('is-menu-open');
				$('#furniture').show();
				scope.updateGallery();
			});
		}
	};
	this.cartExpand = function(){
		if ($('.jsCartItemOpener').length !== 0){
			var $cartopener = $('.jsCartItemOpener');
			$('.jsCartDelete', $cartopener).click(function(e){
				e.stopPropagation();
				e.preventDefault();
			});
			$('.jsCartPrint', $cartopener).click(function(e){
				e.stopPropagation();
				e.preventDefault();
			});
			$('.btn_gray', $cartopener).click(function(e){
				e.stopPropagation();
				e.preventDefault();
			});
			$('.jsCartMore', $cartopener).click(function(e){
				e.preventDefault();
			});
			$cartopener.click(function(e){
				$(this).toggleClass('is-active');
				$(this).next('.cart__expand').slideToggle();
			});
		}
	};
    this.bannersAnimation = function(){
        var t1;
        if ($('.jsPromoStatic').length !== 0){
            bannerSlide();
            $(window).on({
                'scroll': function(){
                    bannerSlide();
                }
            });
        }

        function bannerSlide(){
            clearTimeout(t1);
            if ($(window).scrollTop() > 190){
                $('body').addClass('is-promoDown');
                $('.jsPromoStatic').show();
                $('.jsPromo').hide();
            } else {
                $('body').removeClass('is-promoDown');
                t1 = setTimeout(function(){
                    $('.jsPromoStatic').hide();
                    $('.jsPromo').show();
                }, 300);
            }
        }
    };

    $(function(){
        scope.commonFeatures();
        scope.searchBlock();
        scope.cartBlock();
        scope.menuDropdown();
        scope.mainGallery();
        scope.cloudZoom();
        scope.initTabs();
        scope.singleGallery();
        scope.coverTooltip();
        scope.menuOpener();
        scope.cartExpand();
        scope.bannersAnimation();
    });
}