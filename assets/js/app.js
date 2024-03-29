var windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
    windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
    let $childUl = $parent.find('> li > ul');
    if ($childUl.length === 0) {
        return;
    }

    if ($callFunction) {
        $parent.find('> li a').each(function () {
            $(this).attr('data-href', $(this).attr('href'))
        });
    }

    if (windowWidth <= 991) {

        let $objParentAttr = {};
        let $objChildrenAttr = {
            'data-bs-parent': '#' + $parent.attr('id')
        }

        if ($firstItem) {
            let $parentID = 'menu-' + Math.random().toString(36).substring(7);
            $parent.attr('id', $parentID);
            $objParentAttr = {
                'data-bs-parent': '#' + $parentID
            }

            $objChildrenAttr = {};
        }

        $childUl.each(function () {
            let $parentUl = $(this).closest('ul');
            let $parentListItem = $(this).closest('li');
            let $parentListItemAnchor = $parentListItem.children('a');

            let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

            $parentUl.addClass('collapse').attr({
                'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
            });

            $parentListItemAnchor.replaceWith(function () {
                return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
            })

            handleApplyCollapse($parentUl, false);

            $parentUl.on('show.bs.collapse', function () {
                $parent.find('.collapse.show').not($parentUl).collapse('hide');
            });
        });
    } else {
        $parent.removeAttr('id');

        $childUl.each(function () {
            let $parentUl = $(this).closest('ul');
            let $parentListItem = $(this).closest('li');

            $parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
            $parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

            $parentListItem.children('button').replaceWith(function () {
                return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
            })

            handleApplyCollapse($parentUl);
        });
    }
}

let handleCallMenu = function () {
    const $body = $('body');
    const handleBody = function ($toggle = false) {
        if ($body.hasClass('is-navigation')) {
            $body.removeClass('is-navigation');
            if ($body.hasClass('is-overflow')) {
                $body.removeClass('is-overflow');
            }

            $('#header-navigation ul').collapse('hide');
        } else {
            if ($toggle) {
                $body.addClass('is-navigation is-overflow')
            }
        }
    }

    if (windowWidth <= 991) {
        const $hamburger = $('#hamburger-button');
        if ($hamburger.length) {
            $hamburger.click(function () {
                handleBody(true)
            });
        }

        const $overlay = $('#header-overlay');
        if ($overlay.length) {
            $overlay.click(function () {
                handleBody();
            });
        }
    } else {
        handleBody();
    }
}

const handleStickHeader = function () {
    $(window).scroll(function (e) {
        if ($(document).scrollTop() > $('#header').innerHeight()) {
            $('#header').addClass('is-scroll');
        } else {
            $('#header').removeClass('is-scroll');
        }
    });
}


const handleCopyValue = function () {
    const copyButtons = document.querySelectorAll('.button-copy');
    if (copyButtons) {
        copyButtons.forEach(function (copyButton) {
            copyButton.addEventListener('click', function () {
                const valueToCopy = copyButton.getAttribute('data-value');

                const tempTextArea = document.createElement('textarea');
                tempTextArea.style.cssText = 'position: absolute; left: -99999px';
                tempTextArea.setAttribute("id", "textareaCopy");
                document.body.appendChild(tempTextArea);

                let textareaElm = document.getElementById('textareaCopy');
                textareaElm.value = valueToCopy;
                textareaElm.select();
                textareaElm.setSelectionRange(0, 99999);
                document.execCommand('copy');

                document.body.removeChild(textareaElm);

                if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
                    copyButton.setAttribute('title', 'Đã sao chéo');

                    const tooltip = bootstrap.Tooltip.getInstance(copyButton);
                    tooltip.setContent({'.tooltip-inner': 'Đã sao chéo'})
                }
            });
        })
    }
}

const handleInitFancybox = function () {
    if ($('.initFancybox').length) {
        $('.initFancybox').each(function () {
            let elm = $(this);
            Fancybox.bind(`[data-fancybox=${elm.attr('data-fancybox')}]`, {
                thumbs: {
                    autoStart: true,
                },
            });
        });
    }
}


$(function () {
    handleApplyCollapse($('#header-navigation > ul'), true, true);
    handleCallMenu();
    $(window).resize(function () {
        handleApplyCollapse($('#header-navigation > ul'));
        handleCallMenu();
    })
    handleStickHeader();
    handleCopyValue();
    handleInitFancybox();

    if ($('.callSearch').length) {
        $('.callSearch').click(function () {
            let headerSearch = $(this).closest('.headerSearch');
            headerSearch.toggleClass('is-search')
        });
    }

    if ($('#slider-banner').length) {
        new Swiper('#slider-banner .swiper', {
            speed: 500,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            loop: 1,
            pagination: {
                el: "#slider-banner .slider-pagination",
                clickable: 1,
            },
            navigation: {
                nextEl: "#slider-banner .slider-buttons .slider-button_next",
                prevEl: "#slider-banner .slider-buttons .slider-button_prev",
            },
        });
    }

    if ($('#slider-video').length) {
        new Swiper('#slider-video .swiper', {
            speed: 500,
            spaceBetween: 15,
            slidesPerView: 4,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            loop: 1,
            navigation: {
                nextEl: "#slider-video .slider-buttons .slider-button_next",
                prevEl: "#slider-video .slider-buttons .slider-button_prev",
            },
            breakpoints: {
                1359: {
                    slidesPerView: 4,
                },
                768: {
                    slidesPerView: 2.5,
                },
                375: {
                    slidesPerView: 1.5,
                },
                320: {
                    slidesPerView: 1,
                }
            },
        });
    }

    if ($('#slider-gallery').length) {
        new Swiper('#slider-gallery .swiper', {
            speed: 500,
            spaceBetween: 15,
            slidesPerView: 4,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            loop: 1,
            navigation: {
                nextEl: "#slider-gallery .slider-buttons .slider-button_next",
                prevEl: "#slider-gallery .slider-buttons .slider-button_prev",
            },
            breakpoints: {
                1359: {
                    slidesPerView: 4,
                },
                768: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 2.5,
                },
                375: {
                    slidesPerView: 1.5,
                },
                320: {
                    slidesPerView: 1,
                }
            },
        });
    }

    if ($('#slider-partner').length) {
        new Swiper('#slider-partner .swiper', {
            speed: 500,
            spaceBetween: 15,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            loop: 1,
            navigation: {
                nextEl: "#slider-partner .slider-buttons .slider-button_next",
                prevEl: "#slider-partner .slider-buttons .slider-button_prev",
            },
            breakpoints: {
                1359: {
                    slidesPerView: 8,
                },
                768: {
                    slidesPerView: 3.5,
                },
                375: {
                    slidesPerView: 2.5,
                },
                320: {
                    slidesPerView: 1,
                }
            },
        });
    }


    if ($('#slider-relatedArticles').length) {
        new Swiper('#slider-relatedArticles .swiper', {
            speed: 500,
            spaceBetween: 15,
            slidesPerView: 4,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            loop: 1,
            navigation: {
                nextEl: "#slider-relatedArticles .slider-buttons .slider-button_next",
                prevEl: "#slider-relatedArticles .slider-buttons .slider-button_prev",
            },
            breakpoints: {
                1359: {
                    slidesPerView: 4,
                },
                768: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 2.5,
                },
                375: {
                    slidesPerView: 1.5,
                },
                320: {
                    slidesPerView: 1,
                }
            },
        });
    }

    const handleInitDateRangePicker = function (elmInput) {
        let format = 'DD-MM-YYYY';
        const initDateRangePicker = elmInput.daterangepicker({
            singleDatePicker: true,
            alwaysShowCalendars: true,
            timePicker: false,
            timePicker24Hour: false,
            timePickerSeconds: false,
            parentEl: 'body',
            autoApply: true,
            locale: {
                format: format,
                daysOfWeek: [
                    "CN",
                    "T2",
                    "T3",
                    "T4",
                    "T5",
                    "T6",
                    "T7"
                ],
                monthNames: [
                    "Tháng 1",
                    "Tháng 2",
                    "Tháng 3",
                    "Tháng 4",
                    "Tháng 5",
                    "Tháng 6",
                    "Tháng 7",
                    "Tháng 8",
                    "Tháng 9",
                    "Tháng 10",
                    "Tháng 11",
                    "Tháng 12"
                ],
                applyLabel: 'Áp dụng',
                cancelLabel: 'Đóng',
            }
        });

        if (typeof type != "undefined" && type === 'time') {
            initDateRangePicker.on('show.daterangepicker', function (ev, picker) {
                picker.container.find(".drp-calendar").addClass('px-3');
                picker.container.find(".calendar-table").hide();
            });
        }
    }
    $('.initDateRangePicker input').each(function () {
        let elmInput = $(this);

        elmInput.on('focus', function () {
            handleInitDateRangePicker(elmInput)
        })
    });

    if ($('.callAlbum').length) {
        $('.callAlbum').click(function () {
            // Giữ đúng key của option
            let listImage = [
                {
                    'src': 'assets/images/gallery/HOI-THI-TAY-NGHE-2022-35-2048x1536.jpg',
                    'caption': 'Hình ảnh Bệnh viện giai đoạn 1903-2013',
                },
                {
                    'src': 'assets/images/gallery/ALBUM-ANH-110-NAM-1.jpg',
                    'caption': 'Hình ảnh Bệnh viện giai đoạn 1903-2024',
                },
                {
                    'src': 'assets/images/gallery/HOI-THI-TAY-NGHE-2022-35-2048x1536.jpg',
                    'caption': 'Hình ảnh Bệnh viện giai đoạn 1903-2013',
                },
                {
                    'src': 'assets/images/gallery/ALBUM-ANH-110-NAM-1.jpg',
                    'caption': 'Hình ảnh Bệnh viện giai đoạn 1903-2024',
                },
                {
                    'src': 'assets/images/gallery/HOI-THI-TAY-NGHE-2022-35-2048x1536.jpg',
                    'caption': 'Hình ảnh Bệnh viện giai đoạn 1903-2013',
                },
                {
                    'src': 'assets/images/gallery/ALBUM-ANH-110-NAM-1.jpg',
                    'caption': 'Hình ảnh Bệnh viện giai đoạn 1903-2024',
                },
                {
                    'src': 'assets/images/gallery/HOI-THI-TAY-NGHE-2022-35-2048x1536.jpg',
                    'caption': 'Hình ảnh Bệnh viện giai đoạn 1903-2013',
                },
                {
                    'src': 'assets/images/gallery/ALBUM-ANH-110-NAM-1.jpg',
                    'caption': 'Hình ảnh Bệnh viện giai đoạn 1903-2024',
                },
            ];

            Fancybox.show(listImage);
        });
    }

});