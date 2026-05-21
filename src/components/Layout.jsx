import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Home', id: '31226' },
  { path: '/about', label: 'About us', id: '31015' },
  { path: '/exhibitors', label: 'Exhibitors', id: '31017' },
  { path: '/visitors', label: 'Visitors', id: '31018' },
  { path: '/stall-booking', label: 'Stall Booking', id: '31064' },
  { path: '/sponsors-partners', label: 'Sponsors &amp; Partners', id: '31088' },
  { path: '/media-gallery', label: 'Media &amp; Gallery', id: '31095' },
  { path: '/faqs', label: 'FAQs', id: '31096' },
  { path: '/blog', label: 'Blog', id: '29496' },
  { path: '/contact', label: 'Contact Us', id: '29498' },
];

function isActive(itemPath, pathname) {
  if (itemPath === '/') return pathname === '/';
  return pathname === itemPath || pathname.startsWith(itemPath + '/');
}

function buildMobileMenu(pathname) {
  return NAV_ITEMS.map(item => {
    const active = isActive(item.path, pathname);
    const cls = active
      ? `menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item current_page_item menu-item-${item.id}`
      : `menu-item menu-item-type-post_type menu-item-object-page menu-item-${item.id}`;
    return `<li id="menu-item-${item.id}" class="${cls}"><a href="${item.path}"${active ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
  }).join('\n');
}

function buildDesktopMenu(pathname) {
  return NAV_ITEMS.map(item => {
    const active = isActive(item.path, pathname);
    const cls = active
      ? `menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item current_page_item parent hfe-creative-menu`
      : `menu-item menu-item-type-post_type menu-item-object-page parent hfe-creative-menu`;
    return `<li id="menu-item-${item.id}" class="${cls}"><a href="${item.path}" class="hfe-menu-item">${item.label}<em class="rs__menu_sp_dyc"><i class="ri-arrow-right-line"></i></em></a></li>`;
  }).join('\n');
}

function buildFooterMenu(pathname) {
  return NAV_ITEMS.map(item => {
    const active = isActive(item.path, pathname);
    const cls = active
      ? `menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item current_page_item parent hfe-creative-menu`
      : `menu-item menu-item-type-post_type menu-item-object-page parent hfe-creative-menu`;
    return `<li id="menu-item-f-${item.id}" class="${cls}"><a href="${item.path}" class="hfe-menu-item">${item.label}<em class="rs__menu_sp_dyc"><i class="ri-arrow-right-line"></i></em></a></li>`;
  }).join('\n');
}

export default function Layout({ children, pageCss = [], bodyClass = '' }) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.className = bodyClass ||
      'wp-singular page-template page-template-elementor_header_footer page wp-custom-logo wp-theme-industrie elementor-default elementor-template-full-width elementor-kit-23 elementor-default';

    pageCss.forEach(({ id, href }) => {
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = id;
        link.href = process.env.PUBLIC_URL + href;
        document.head.appendChild(link);
      }
    });

    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      const $ = window.jQuery;
      if (!$) return;

      try {
        if ($.fn.owlCarousel) {
          $('.owl-carousel').each(function () {
            if (!$(this).hasClass('owl-loaded')) {
              const items = parseInt($(this).data('items')) || 3;
              const loop = $(this).data('loop') !== false;
              const dots = $(this).data('dots') !== false;
              const nav = $(this).data('nav') !== false;
              $(this).owlCarousel({
                loop, dots, nav, margin: 10,
                responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items } }
              });
            }
          });
        }
      } catch (e) { console.warn('Owl:', e); }

      try {
        if ($.fn.slick) {
          $('.slick-slider:not(.slick-initialized)').slick({ dots: true, infinite: true, autoplay: true });
        }
      } catch (e) { }

      try {
        if ($.fn.magnificPopup) {
          $('.popup-video, .mfp-iframe, .video-popup').magnificPopup({ type: 'iframe', mainClass: 'mfp-fade' });
          $('.popup-image, .mfp-image, .image-popup').magnificPopup({ type: 'image' });
        }
      } catch (e) { }

      try {
        if (window.Odometer) {
          $('.odometer').each(function () {
            const val = $(this).data('count') || $(this).attr('data-count') || 0;
            new window.Odometer({ el: this, value: 0 });
            setTimeout(() => { $(this).html(val); }, 500);
          });
        }
      } catch (e) { }

      try {
        if (window.Swiper) {
          document.querySelectorAll('.swiper:not(.swiper-initialized)').forEach(el => {
            new window.Swiper(el, {
              loop: true,
              autoplay: { delay: 3000, disableOnInteraction: false },
              pagination: { el: '.swiper-pagination', clickable: true },
              navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            });
          });
        }
      } catch (e) { }

      try {
        $(window).off('scroll.sticky').on('scroll.sticky', function () {
          if ($(this).scrollTop() > 100) {
            $('header, .rs-header, .menu-sticky').addClass('sticky');
          } else {
            $('header, .rs-header, .menu-sticky').removeClass('sticky');
          }
        });
      } catch (e) { }

      try {
        if ($.fn.isotope && $.fn.imagesLoaded) {
          const $grid = $('.portfolio-items, .isotope-grid, .rs-portfolio');
          $grid.imagesLoaded(function () {
            $grid.isotope({ itemSelector: '.portfolio-item, .grid-item', layoutMode: 'fitRows' });
          });
          $('.portfolio-filter a, .filter-btn').on('click', function () {
            const filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
          });
        }
      } catch (e) { }

      try {
        if ($.fn.waypoint) {
          $('.counter-number, .rs-count').waypoint(function () {
            $(this.element).each(function () {
              const target = parseInt($(this).data('to') || $(this).text());
              $(this).prop('Counter', 0).animate({ Counter: target }, {
                duration: 2000,
                step: function (now) { $(this).text(Math.ceil(now)); }
              });
            });
          }, { offset: '80%', triggerOnce: true });
        }
      } catch (e) { }

      try {
        $('#pre-load, .rs-loader, .preloader').fadeOut(500);
      } catch (e) { }

      // Nav expander (offcanvas)
      try {
        $('.nav-expander').off('click.offcanvas').on('click.offcanvas', function () {
          $('body').addClass('nav-expanded');
          $('.right_menu_togle').addClass('menu-toggle-open');
          $('.rsoffwrap').addClass('rsoffwrap-open');
        });
        $('.rsoffwrap, .rsoffwrap-close').off('click.offcanvas').on('click.offcanvas', function () {
          $('body').removeClass('nav-expanded');
          $('.right_menu_togle').removeClass('menu-toggle-open');
          $('.rsoffwrap').removeClass('rsoffwrap-open');
        });
      } catch (e) { }

    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const mobileMenu = buildMobileMenu(pathname);
  const desktopMenu = buildDesktopMenu(pathname);
  const footerMenu = buildFooterMenu(pathname);

  const offcanvasHtml = `
<div class="rsoffwrap"></div>
<nav class="right_menu_togle">
  <div class="rsoffwrap-close"><i class="ri-close-line"></i></div>
  <nav class="nav navbar">
    <div class="navbar-menu">
      <div class="menu-main-menu-container">
        <ul id="mobile_menu_rstheme" class="menu rs_mobile_menu">
          ${mobileMenu}
        </ul>
      </div>
    </div>
  </nav>
</nav>`;

  const headerHtml = `
<div class="header-inner">
  <div data-elementor-type="wp-post" data-elementor-id="20407" class="elementor elementor-20407">
    <header class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-a40512c e-con-full e-flex e-con e-parent e-lazyloaded" data-id="a40512c" data-element_type="container" data-e-type="container">
      <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-4d7d6b1 e-con-full rs-full-responsive rs--mobile-hides rs--mobile-hides-header2 elementor-hidden-mobile e-flex e-con e-child" data-id="4d7d6b1" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-916cfd1 e-con-full e-flex e-con e-child" data-id="916cfd1" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div class="elementor-element elementor-element-56b81d1 elementor-widget elementor-widget-image" data-id="56b81d1" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
            <a href="/"><img fetchpriority="high" width="640" height="228" src="/images/engitech-2-1-768x274-1.png" class="attachment-large size-large wp-image-29638" alt="Engitech Expo"></a>
          </div>
        </div>
        <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-0a0cb0b e-con-full e-flex e-con e-child" data-id="0a0cb0b" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-21bb47d e-con-full e-flex e-con e-child" data-id="21bb47d" data-element_type="container" data-e-type="container">
            <div class="elementor-element elementor-element-dfc4242 elementor-hidden-tablet elementor-hidden-mobile hfe-nav-menu__breakpoint-none elementor-widget-laptop__width-inherit hfe-nav-menu__align-left hfe-submenu-icon-arrow hfe-submenu-animation-none hfe-link-redirect-child elementor-widget elementor-widget-navigation-menu" data-id="dfc4242" data-element_type="widget" data-e-type="widget" data-widget_type="navigation-menu.default">
              <div class="elementor-widget-container">
                <div class="hfe-nav-menu hfe-layout-horizontal normal hfe-nav-menu-layout mega_columns3 horizontal hfe-pointer__none" data-layout="horizontal">
                  <div class="hfe-nav-menu__toggle elementor-clickable" aria-haspopup="true" aria-expanded="false">
                    <div class="hfe-nav-menu-icon"></div>
                  </div>
                  <nav class="hfe-nav-menu__layout-horizontal hfe-nav-menu__submenu-arrow no-separator border-tops no-circle arrow rs-icon-dis" data-toggle-icon="" data-close-icon="" data-full-width="">
                    <ul id="menu-1-dfc4242" class="hfe-nav-menu">${desktopMenu}</ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-65ff9aa e-con-full e-flex e-con e-child" data-id="65ff9aa" data-element_type="container" data-e-type="container">
            <div class="elementor-element elementor-element-2bf8d67 elementor-widget elementor-widget-rs-button" data-id="2bf8d67" data-element_type="widget" data-e-type="widget" data-widget_type="rs-button.default">
              <div class="elementor-widget-container">
                <div class="rs-button style1">
                  <a class="rs-btn" href="/Ahmedabad-2026-Rajkot-2027-Vadodara-2028-12-1.pdf" target="_blank">
                    <span>Download Brochure <em><svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 6C0 5.66249 0.273604 5.38889 0.611111 5.38889L15.0246 5.38889L11.179 1.54323C10.9403 1.30458 10.9403 0.917645 11.179 0.678991C11.4176 0.440337 11.8046 0.440337 12.0432 0.678991L16.9321 5.56788C17.1708 5.80653 17.1708 6.19347 16.9321 6.43212L12.0432 11.321C11.8046 11.5597 11.4176 11.5597 11.179 11.321C10.9403 11.0824 10.9403 10.6954 11.179 10.4568L15.0246 6.61111L0.611111 6.61111C0.273604 6.61111 0 6.33751 0 6Z" fill="white"></path></svg></em></span>
                  </a>
                </div>
              </div>
            </div>
            <div class="elementor-element elementor-element-e6809d7 elementor-hidden-desktop elementor-hidden-laptop elementor-widget elementor-widget-rsoffcanvas" data-id="e6809d7" data-element_type="widget" data-e-type="widget" data-widget_type="rsoffcanvas.default">
              <div class="elementor-widget-container">
                <div class="rs-offcanvas-area">
                  <ul><li class="nav-link pr-20"><a class="nav-expander"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"><path d="M8.55566 11H1.55566C1.29045 11 1.03609 11.1054 0.848557 11.2929C0.661021 11.4804 0.555664 11.7348 0.555664 12V19C0.555664 19.2652 0.661021 19.5196 0.848557 19.7071C1.03609 19.8946 1.29045 20 1.55566 20H8.55566C8.82088 20 9.07523 19.8946 9.26277 19.7071C9.45031 19.5196 9.55566 19.2652 9.55566 19V12C9.55566 11.7348 9.45031 11.4804 9.26277 11.2929C9.07523 11.1054 8.82088 11 8.55566 11ZM7.55566 18H2.55566V13H7.55566V18ZM19.5557 0H12.5557C12.2904 0 12.0361 0.105357 11.8486 0.292893C11.661 0.48043 11.5557 0.734784 11.5557 1V8C11.5557 8.26522 11.661 8.51957 11.8486 8.70711C12.0361 8.89464 12.2904 9 12.5557 9H19.5557C19.8209 9 20.0752 8.89464 20.2628 8.70711C20.4503 8.51957 20.5557 8.26522 20.5557 8V1C20.5557 0.734784 20.4503 0.48043 20.2628 0.292893C20.0752 0.105357 19.8209 0 19.5557 0ZM18.5557 7H13.5557V2H18.5557V7ZM19.5557 11H12.5557C12.2904 11 12.0361 11.1054 11.8486 11.2929C11.661 11.4804 11.5557 11.7348 11.5557 12V19C11.5557 19.2652 11.661 19.5196 11.8486 19.7071C12.0361 19.8946 12.2904 20 12.5557 20H19.5557C19.8209 20 20.0752 19.8946 20.2628 19.7071C20.4503 19.5196 20.5557 19.2652 20.5557 19V12C20.5557 11.7348 20.4503 11.4804 20.2628 11.2929C20.0752 11.1054 19.8209 11 19.5557 11ZM18.5557 18H13.5557V13H18.5557V18ZM8.55566 0H1.55566C1.29045 0 1.03609 0.105357 0.848557 0.292893C0.661021 0.48043 0.555664 0.734784 0.555664 1V8C0.555664 8.26522 0.661021 8.51957 0.848557 8.70711C1.03609 8.89464 1.29045 9 1.55566 9H8.55566C8.82088 9 9.07523 8.89464 9.26277 8.70711C9.45031 8.51957 9.55566 8.26522 9.55566 8V1C9.55566 0.734784 9.45031 0.48043 9.26277 0.292893C9.07523 0.105357 8.82088 0 8.55566 0ZM7.55566 7H2.55566V2H7.55566V7Z" fill="#616161"></path></svg></a></li></ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Mobile header row -->
      <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-377eaa9 e-con-full rs-full-responsive rs--mobile-hides rs--mobile-hides-header2 elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet e-flex e-con e-child" data-id="377eaa9" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-7390859 e-con-full e-flex e-con e-child" data-id="7390859" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div class="elementor-element elementor-element-2cadd42 elementor-widget elementor-widget-image" data-id="2cadd42" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
            <a href="/"><img fetchpriority="high" width="640" height="228" src="/images/engitech-2-1-768x274-1.png" class="attachment-large size-large wp-image-29638" alt="Engitech Expo"></a>
          </div>
          <div class="elementor-element elementor-element-85ff95f elementor-hidden-desktop elementor-hidden-laptop elementor-widget elementor-widget-rsoffcanvas" data-id="85ff95f" data-element_type="widget" data-e-type="widget" data-widget_type="rsoffcanvas.default">
            <div class="elementor-widget-container">
              <div class="rs-offcanvas-area">
                <ul><li class="nav-link pr-20"><a class="nav-expander"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"><path d="M8.55566 11H1.55566C1.29045 11 1.03609 11.1054 0.848557 11.2929C0.661021 11.4804 0.555664 11.7348 0.555664 12V19C0.555664 19.2652 0.661021 19.5196 0.848557 19.7071C1.03609 19.8946 1.29045 20 1.55566 20H8.55566C8.82088 20 9.07523 19.8946 9.26277 19.7071C9.45031 19.5196 9.55566 19.2652 9.55566 19V12C9.55566 11.7348 9.45031 11.4804 9.26277 11.2929C9.07523 11.1054 8.82088 11 8.55566 11ZM7.55566 18H2.55566V13H7.55566V18ZM19.5557 0H12.5557C12.2904 0 12.0361 0.105357 11.8486 0.292893C11.661 0.48043 11.5557 0.734784 11.5557 1V8C11.5557 8.26522 11.661 8.51957 11.8486 8.70711C12.0361 8.89464 12.2904 9 12.5557 9H19.5557C19.8209 9 20.0752 8.89464 20.2628 8.70711C20.4503 8.51957 20.5557 8.26522 20.5557 8V1C20.5557 0.734784 20.4503 0.48043 20.2628 0.292893C20.0752 0.105357 19.8209 0 19.5557 0ZM18.5557 7H13.5557V2H18.5557V7ZM19.5557 11H12.5557C12.2904 11 12.0361 11.1054 11.8486 11.2929C11.661 11.4804 11.5557 11.7348 11.5557 12V19C11.5557 19.2652 11.661 19.5196 11.8486 19.7071C12.0361 19.8946 12.2904 20 12.5557 20H19.5557C19.8209 20 20.0752 19.8946 20.2628 19.7071C20.4503 19.5196 20.5557 19.2652 20.5557 19V12C20.5557 11.7348 20.4503 11.4804 20.2628 11.2929C20.0752 11.1054 19.8209 11 19.5557 11ZM18.5557 18H13.5557V13H18.5557V18ZM8.55566 0H1.55566C1.29045 0 1.03609 0.105357 0.848557 0.292893C0.661021 0.48043 0.555664 0.734784 0.555664 1V8C0.555664 8.26522 0.661021 8.51957 0.848557 8.70711C1.03609 8.89464 1.29045 9 1.55566 9H8.55566C8.82088 9 9.07523 8.89464 9.26277 8.70711C9.45031 8.51957 9.55566 8.26522 9.55566 8V1C9.55566 0.734784 9.45031 0.48043 9.26277 0.292893C9.07523 0.105357 8.82088 0 8.55566 0ZM7.55566 7H2.55566V2H7.55566V7Z" fill="#616161"></path></svg></a></li></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</div>
<div id="rs-theme-toggle" class="rs_ld_btn" style="opacity: 0; display: none;">
  <span class="d-block-light"><i class="ri-sun-line"></i></span>
  <span class="d-block-dark"><i class="ri-moon-line"></i></span>
</div>`;

  const footerHtml = `
<style>
.custom-footer-section {
  background-color: #fff;
  padding: 60px 0 20px;
  font-family: 'Poppins', sans-serif;
  color: #616161;
}
.custom-footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
.custom-footer-top {
  border-top: 1px solid #eaeaea;
  padding-top: 50px;
}
.custom-footer-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 -15px;
}
.custom-footer-col {
  padding: 0 15px;
  margin-bottom: 30px;
}
.custom-footer-col-1 { width: 25%; }
.custom-footer-col-2 { width: 20%; }
.custom-footer-col-3 { width: 25%; }
.custom-footer-col-4 { width: 25%; }

.custom-footer-col h3.footer-widget-title {
  font-size: 18px;
  color: #055DA8;
  font-weight: 700;
  margin-bottom: 25px;
  position: relative;
}

.footer-desc {
  font-size: 14px;
  line-height: 1.6;
  margin: 20px 0;
}
.footer-logo img {
  max-width: 200px;
  height: auto;
}
.organised-by-text {
  font-size: 18px;
  font-weight: 600;
  color: #F69025;
  margin-bottom: 10px;
  font-family: 'Space Grotesk', sans-serif;
}
.organiser-logo img {
  max-width: 150px;
  height: auto;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-links-list li {
  margin-bottom: 12px;
}
.footer-links-list li a {
  color: #616161;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}
.footer-links-list li a:hover {
  color: #EA5501;
}

.footer-address-block {
  margin-bottom: 20px;
}
.footer-address-block h4 {
  font-size: 16px;
  color: #055DA8;
  font-weight: 700;
  margin-bottom: 5px;
}
.footer-address-block p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.footer-contact-block {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
}
.footer-contact-icon {
  margin-right: 15px;
  margin-top: 3px;
  color: #616161;
}
.footer-contact-icon svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}
.footer-contact-details h4 {
  font-size: 16px;
  color: #055DA8;
  font-weight: 700;
  margin: 0 0 5px 0;
}
.footer-contact-details p, .footer-contact-details a {
  font-size: 14px;
  color: #616161;
  text-decoration: none;
  margin: 0;
  display: block;
}
.footer-contact-details a:hover {
  color: #EA5501;
}

.footer-social-title {
  font-size: 16px;
  color: #055DA8;
  font-weight: 700;
  margin-bottom: 15px;
}
.footer-social-icons {
  display: flex;
  gap: 10px;
}
.footer-social-icons a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: transform 0.3s;
}
.footer-social-icons a:hover {
  transform: translateY(-3px);
}
.footer-social-icons svg {
  width: 100%;
  height: 100%;
}

.custom-footer-bottom {
  text-align: center;
  padding: 25px 0;
  border-top: 1px solid #eaeaea;
  margin-top: 20px;
  font-size: 12px;
  color: #616161;
}
.custom-footer-bottom a {
  color: #f7a44c;
  text-decoration: none;
}
.custom-footer-bottom a:hover {
  text-decoration: underline;
}

@media (max-width: 991px) {
  .custom-footer-col-1, .custom-footer-col-3 { width: 50%; }
  .custom-footer-col-2, .custom-footer-col-4 { width: 50%; }
}
@media (max-width: 767px) {
  .custom-footer-col { width: 100%; }
}
</style>
<div class="custom-footer-section">
  <div class="custom-footer-container">
    <div class="custom-footer-top">
      <div class="custom-footer-row">
        
        <!-- Col 1 -->
        <div class="custom-footer-col custom-footer-col-1">
          <div class="footer-logo">
            <a href="/"><img src="/images/engitech-2-1-768x274-1.png" alt="Engitech Expo"></a>
          </div>
          <div class="footer-desc">
            Engitech Expo is a leading industrial exhibition where businesses explore cutting-edge technologies and global partnerships.
          </div>
          <div class="organised-by-text">Organised By</div>
          <div class="organiser-logo">
            <a href="/"><img src="/images/Shree-Communication-Logo-600x325-1.png" alt="Shree Communication"></a>
          </div>
        </div>

        <!-- Col 2 -->
        <div class="custom-footer-col custom-footer-col-2">
          <h3 class="footer-widget-title">Useful Links</h3>
          <ul class="footer-links-list">
            ${footerMenu}
          </ul>
        </div>

        <!-- Col 3 -->
        <div class="custom-footer-col custom-footer-col-3">
          <div class="footer-address-block">
            <h4>Corporate Office</h4>
            <p>301, 3rd Floor, Krishna Complex, Nr. H.P. Petrol Pump, Wonder Point, CTM, Ahmedabad-26</p>
          </div>
          <div class="footer-address-block">
            <h4>Head Office</h4>
            <p>408, RK Empire, Near Mavdi Circle, 150 Feet Ring Road, Rajkot – 360004.</p>
          </div>
          <div class="footer-address-block">
            <h4>Branch</h4>
            <p>Vadodara</p>
          </div>
        </div>

        <!-- Col 4 -->
        <div class="custom-footer-col custom-footer-col-4">
          <div class="footer-contact-block">
            <div class="footer-contact-icon">
              <svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
            </div>
            <div class="footer-contact-details">
              <h4>Email Address</h4>
              <a href="mailto:info@engitechexpo.com">info@engitechexpo.com</a>
            </div>
          </div>
          <div class="footer-contact-block">
            <div class="footer-contact-icon">
              <svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
            </div>
            <div class="footer-contact-details">
              <h4>Phone Number</h4>
              <a href="tel:+919601945255">+91 96019 45255</a>
              <a href="tel:+919574897793">+91 95748 97793</a>
            </div>
          </div>
          <div class="footer-social-title">Follow Us</div>
          <div class="footer-social-icons">
            <a href="https://www.facebook.com/engitechexpo" target="_blank"><svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#18ACFE"></circle><path d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z" fill="white"></path></svg></a>
            <a href="https://www.instagram.com/engitechexpo_/" target="_blank"><svg viewBox="0 0 512 512"><rect width="512" height="512" rx="75" fill="#E1306C"></rect><g fill="none" stroke="#fff" stroke-width="40"><rect width="308" height="308" x="102" y="102" rx="81"></rect><circle cx="256" cy="256" r="72"></circle><circle cx="347" cy="165" r="15" fill="#fff" stroke="none"></circle></g></svg></a>
            <a href="https://www.youtube.com/@EngitechExpo" target="_blank"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#FF0000"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M35.3005 16.3781C35.6996 16.7772 35.9872 17.2739 36.1346 17.8187C36.9835 21.2357 36.7873 26.6324 36.1511 30.1813C36.0037 30.7261 35.7161 31.2228 35.317 31.6219C34.9179 32.021 34.4212 32.3086 33.8764 32.456C31.8819 33 23.8544 33 23.8544 33C23.8544 33 15.8269 33 13.8324 32.456C13.2876 32.3086 12.7909 32.021 12.3918 31.6219C11.9927 31.2228 11.7051 30.7261 11.5577 30.1813C10.7038 26.7791 10.9379 21.3791 11.5412 17.8352C11.6886 17.2903 11.9762 16.7936 12.3753 16.3945C12.7744 15.9954 13.2711 15.7079 13.8159 15.5604C15.8104 15.0165 23.8379 15 23.8379 15C23.8379 15 31.8654 15 33.8599 15.544C34.4047 15.6914 34.9014 15.979 35.3005 16.3781ZM27.9423 24L21.283 27.8571V20.1428L27.9423 24Z" fill="white"></path></svg></a>
            <a href="https://www.linkedin.com/company/engitechexpo/" target="_blank"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#0077B5"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M18.7747 14.2839C18.7747 15.529 17.8267 16.5366 16.3442 16.5366C14.9194 16.5366 13.9713 15.529 14.0007 14.2839C13.9713 12.9783 14.9193 12 16.3726 12C17.8267 12 18.7463 12.9783 18.7747 14.2839ZM14.1199 32.8191V18.3162H18.6271V32.8181H14.1199V32.8191Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22.2393 22.9446C22.2393 21.1357 22.1797 19.5935 22.1201 18.3182H26.0351L26.2432 20.305H26.3322C26.9254 19.3854 28.4079 17.9927 30.8101 17.9927C33.7752 17.9927 35.9995 19.9502 35.9995 24.219V32.821H31.4922V24.7838C31.4922 22.9144 30.8404 21.6399 29.2093 21.6399C27.9633 21.6399 27.2224 22.4999 26.9263 23.3297C26.8071 23.6268 26.7484 24.0412 26.7484 24.4574V32.821H22.2411V22.9446H22.2393Z" fill="white"></path></svg></a>
          </div>
        </div>

      </div>
    </div>
    
    <!-- Footer Bottom -->
    <div class="custom-footer-bottom">
      <span>&#169; <span id="current-year">${new Date().getFullYear()}</span> ENGITECH. Designed &amp; Developed By <a target="_blank" href="https://fuertedevelopers.in/">Fuerte Developers.</a></span>
    </div>
  </div>
</div>
`;

  return (
    <div className="page-transition">
      <div id="pre-load" style={{ display: 'none' }}>
        <div id="loader" className="loader">
          <div className="loader-container">
            <div className="loader-icon">
              <img src="/images/engitech-2-1-768x274-1.png" alt="Engitech Expo" />
            </div>
          </div>
        </div>
      </div>

      <div className="rs-offcanvas-area" dangerouslySetInnerHTML={{ __html: offcanvasHtml }} />

      <div id="page" className="hfeed site">
        <header id="rs-header" className="single-header" dangerouslySetInnerHTML={{ __html: headerHtml }} />

        {children}

        <footer itemType="https://schema.org/WPFooter" itemScope id="colophon" role="contentinfo"
          dangerouslySetInnerHTML={{ __html: footerHtml }} />
      </div>

      <div id="rs-mouse">
        <div id="cursor-ball" style={{ height: 40, width: 40, borderWidth: 1, transform: 'translate(-50%, -50%)', backgroundColor: 'transparent', opacity: 1, borderColor: 'rgba(156,156,156,0.5)' }}></div>
      </div>
    </div>
  );
}
