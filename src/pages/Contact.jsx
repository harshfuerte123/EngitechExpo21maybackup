import { useState } from 'react';
import Layout from '../components/Layout';
import { formAPI } from '../admin/services/api';
import { toast } from 'react-toastify';

const PAGE_CSS = [{ id: 'page-css-contact', href: '/css/page-contact.css' }];
const BODY_CLASS = 'wp-singular page-template page-template-elementor_header_footer page page-id-15257 wp-custom-logo wp-theme-industrie elementor-default elementor-template-full-width elementor-kit-23 elementor-page elementor-page-15257';

const breadcrumbHtml = `
<div data-elementor-type="wp-post" data-elementor-id="10514" class="elementor elementor-10514">
  <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-41335a8 e-flex e-con-boxed e-con e-parent e-lazyloaded" data-id="41335a8" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
    <div class="e-con-inner">
      <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-5e42932 e-flex e-con-boxed e-con e-child" data-id="5e42932" data-element_type="container" data-e-type="container">
        <div class="e-con-inner">
          <div class="default no-position show_shadow rs-sticky-default elementor-element elementor-element-5052d52 e-con-full e-flex e-con e-child" data-id="5052d52" data-element_type="container" data-e-type="container">
            <div class="elementor-element elementor-element-76b8911 elementor-widget elementor-widget-page-title" data-id="76b8911" data-element_type="widget" data-e-type="widget" data-widget_type="page-title.default">
              <div class="elementor-widget-container">
                <div class="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                  <h1 class="elementor-heading-title elementor-size">Contact</h1>
                </div>
              </div>
            </div>
            <div class="elementor-element elementor-element-9425f56 elementor-widget elementor-widget-rs-breadcrumb" data-id="9425f56" data-element_type="widget" data-e-type="widget" data-widget_type="rs-breadcrumb.default">
              <div class="elementor-widget-container">
                <div class="breadcrumb-area style3">
                  <div class="breadcrumbs-inner">
                    <span property="itemListElement" typeof="ListItem"><a property="item" typeof="WebPage" title="Go to Engitech Expo." href="/" class="home"><span property="name">Engitech Expo</span></a><meta property="position" content="1"></span> &gt; <span property="itemListElement" typeof="ListItem"><span property="name" class="post post-page current-item">Contact</span><meta property="url" content="/contact"><meta property="position" content="2"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

const arrowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none"><path d="M18.5303 6.53033C18.8232 6.23744 18.8232 5.76256 18.5303 5.46967L13.7574 0.696698C13.4645 0.403805 12.9896 0.403805 12.6967 0.696698C12.4038 0.989591 12.4038 1.46447 12.6967 1.75736L16.9393 6L12.6967 10.2426C12.4038 10.5355 12.4038 11.0104 12.6967 11.3033C12.9896 11.5962 13.4645 11.5962 13.7574 11.3033L18.5303 6.53033ZM6.55671e-08 6.75L18 6.75L18 5.25L-6.55671e-08 5.25L6.55671e-08 6.75Z" fill="#0D80CE"/></svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><path d="M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27V54H48V27C48 15.402 38.598 6 27 6C15.402 6 6 15.402 6 27V54H0V27Z" fill="#ffb600"/><path d="M27 12C18.3015 12 11.25 19.0515 11.25 27.75V54H42.75V27.75C42.75 19.0515 35.6985 12 27 12Z" fill="#ffb600"/></svg>`;

const phoneIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>`;

const emailIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;

const locationIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

const clockIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>`;

const customStyles = `
.contact-cards-section {
  background-image: url('/images/contact_2_bg.jpg');
  background-size: cover;
  background-position: center;
  padding: 80px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contact-cards-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.custom-office-card {
  background-color: #1a1a1a;
  border: 1px solid #2a2a2a;
  padding: 40px 30px;
  width: 31%;
  min-width: 280px;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
}

.custom-office-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(#333 1px, transparent 1px);
  background-size: 15px 15px;
  opacity: 0.1;
  pointer-events: none;
}

.custom-office-card > * {
  position: relative;
  z-index: 1;
}

.card-top-icon {
  margin-bottom: 20px;
}

.card-top-icon svg {
  width: 35px;
  height: 35px;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 5px 0;
  line-height: 1.2;
  color: #fff;
}

.card-subtitle {
  font-size: 10px;
  color: #aaa;
  margin-bottom: 25px;
}

.card-detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 11px;
  line-height: 1.5;
  color: #ddd;
}

.card-detail-icon {
  margin-right: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

.card-detail-icon svg {
  width: 14px;
  height: 14px;
  fill: #888;
}

.card-detail-text a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s;
}

.card-detail-text a:hover {
  color: #ffb600;
}

.card-view-btn {
  margin-top: 20px;
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid #444;
  border-radius: 4px;
  color: #aaa;
  text-decoration: none;
  font-size: 10px;
  text-transform: uppercase;
  transition: all 0.3s;
  align-self: flex-start;
  background: transparent;
}

.card-view-btn:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.card-socials {
  margin-top: 25px;
  display: flex;
  gap: 10px;
}

.card-socials a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: transform 0.3s;
}

.card-socials a:hover {
  transform: translateY(-3px);
}

.card-socials svg {
  width: 100%;
  height: 100%;
}
@media (max-width: 991px) {
  .custom-office-card {
    width: 48%;
  }
}
@media (max-width: 767px) {
  .custom-office-card {
    width: 100%;
  }
}
`;

function OfficeCard({ title, address, phone1, phone2, email, viewLocationHref, isHeadOffice }) {
  return (
    <div className="custom-office-card">
      <div className="card-top-icon" dangerouslySetInnerHTML={{ __html: iconSvg }} />
      <h3 className="card-title">{title}</h3>
      <div className="card-subtitle">Mon - Sat 10.00 - 18.00</div>

      <div className="card-detail-item">
        <div className="card-detail-icon" dangerouslySetInnerHTML={{ __html: phoneIconSvg }} />
        <div className="card-detail-text">
          <a href={`tel:${phone1.replace(/\\s+/g, '')}`}>{phone1}</a><br />
          {phone2 && <a href={`tel:${phone2.replace(/\\s+/g, '')}`}>{phone2}</a>}
        </div>
      </div>

      <div className="card-detail-item">
        <div className="card-detail-icon" dangerouslySetInnerHTML={{ __html: emailIconSvg }} />
        <div className="card-detail-text">
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>

      <div className="card-detail-item">
        <div className="card-detail-icon" dangerouslySetInnerHTML={{ __html: locationIconSvg }} />
        <div className="card-detail-text">
          {address}
        </div>
      </div>

      <a href={viewLocationHref} className="card-view-btn" target="_blank" rel="noopener noreferrer">
        View Location &rarr;
      </a>

      {isHeadOffice && (
        <div className="card-socials">
          <a href="https://www.facebook.com/engitechexpo" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#18ACFE"></circle><path d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z" fill="white"></path></svg>
          </a>
          <a href="https://www.instagram.com/engitechexpo_/" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="75" fill="#E1306C"></rect><g fill="none" stroke="#fff" strokeWidth="40"><rect width="308" height="308" x="102" y="102" rx="81"></rect><circle cx="256" cy="256" r="72"></circle><circle cx="347" cy="165" r="10" fill="#fff" stroke="none"></circle></g></svg>
          </a>
          <a href="https://www.youtube.com/@EngitechExpo" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#FF0000"></circle><path fillRule="evenodd" clipRule="evenodd" d="M35.3005 16.3781C35.6996 16.7772 35.9872 17.2739 36.1346 17.8187C36.9835 21.2357 36.7873 26.6324 36.1511 30.1813C36.0037 30.7261 35.7161 31.2228 35.317 31.6219C34.9179 32.021 34.4212 32.3086 33.8764 32.456C31.8819 33 23.8544 33 23.8544 33C23.8544 33 15.8269 33 13.8324 32.456C13.2876 32.3086 12.7909 32.021 12.3918 31.6219C11.9927 31.2228 11.7051 30.7261 11.5577 30.1813C10.7038 26.7791 10.9379 21.3791 11.5412 17.8352C11.6886 17.2903 11.9762 16.7936 12.3753 16.3945C12.7744 15.9954 13.2711 15.7079 13.8159 15.5604C15.8104 15.0165 23.8379 15 23.8379 15C23.8379 15 31.8654 15 33.8599 15.544C34.4047 15.6914 34.9014 15.979 35.3005 16.3781ZM27.9423 24L21.283 27.8571V20.1428L27.9423 24Z" fill="white"></path></svg>
          </a>
          <a href="https://www.linkedin.com/company/engitechexpo/" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#0077B5"></circle><path fillRule="evenodd" clipRule="evenodd" d="M18.7747 14.2839C18.7747 15.529 17.8267 16.5366 16.3442 16.5366C14.9194 16.5366 13.9713 15.529 14.0007 14.2839C13.9713 12.9783 14.9193 12 16.3726 12C17.8267 12 18.7463 12.9783 18.7747 14.2839ZM14.1199 32.8191V18.3162H18.6271V32.8181H14.1199V32.8191Z" fill="white"></path><path fillRule="evenodd" clipRule="evenodd" d="M22.2393 22.9446C22.2393 21.1357 22.1797 19.5935 22.1201 18.3182H26.0351L26.2432 20.305H26.3322C26.9254 19.3854 28.4079 17.9927 30.8101 17.9927C33.7752 17.9927 35.9995 19.9502 35.9995 24.219V32.821H31.4922V24.7838C31.4922 22.9144 30.8404 21.6399 29.2093 21.6399C27.9633 21.6399 27.2224 22.4999 26.9263 23.3297C26.8071 23.6268 26.7484 24.0412 26.7484 24.4574V32.821H22.2411V22.9446H22.2393Z" fill="white"></path></svg>
          </a>
        </div>
      )}
    </div>
  );
}

const DEFAULT_FORM = { name: '', email: '', contactNumber: '', companyName: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSubmitting(true);
    try {
      await formAPI.submitContact(form);
      setSubmitted(true);
      setForm(DEFAULT_FORM);
      toast.success('Message sent successfully! We will get back to you soon.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout pageCss={PAGE_CSS} bodyClass={BODY_CLASS}>
      <div className="header-breadcamb-fixer" dangerouslySetInnerHTML={{ __html: breadcrumbHtml }} />

      <div data-elementor-type="wp-page" data-elementor-id="15257" className="elementor elementor-15257">

        <style dangerouslySetInnerHTML={{ __html: customStyles }} />

        {/* Office Info Section */}
        <div className="contact-cards-section">
          <div className="contact-cards-container">
            <OfficeCard
              title="Corporate Office"
              phone1="+91 96019 45255"
              phone2="+91 95748 97793"
              email="info@engitechexpo.com"
              address="301, 3rd Floor, Krishna Complex, Nr. H.P. Petrol Pump, Wooder Point, CTM, Ahmedabad-26."
              viewLocationHref="https://maps.app.goo.gl/b7FBVSGqPPkKeDDw6"
              isHeadOffice={false}
            />
            <OfficeCard
              title="Head Office"
              phone1="+91 96019 45255"
              phone2="+91 95748 97793"
              email="info@engitechexpo.com"
              address="408, RK Empire, Near Mavdi Circle, 150 Feet Ring Road, Rajkot - 360004."
              viewLocationHref="https://maps.app.goo.gl/b7FBVSGqPPkKeDDw6"
              isHeadOffice={true}
            />
            <OfficeCard
              title="Branch"
              phone1="+91 96019 45255"
              phone2="+91 95748 97793"
              email="info@engitechexpo.com"
              address="Vadodara"
              viewLocationHref="https://maps.app.goo.gl/4CyH82tFmf6L8H1TA"
              isHeadOffice={false}
            />
          </div>
        </div>

        {/* Get in Touch + Maps Section */}
        <div className="default no-position show_shadow rs-sticky-default elementor-element elementor-element-b289e2c e-con-full e-flex e-con e-parent e-lazyloaded" data-id="b289e2c" data-element_type="container" data-e-type="container">

          {/* Form column */}
          <div className="default no-position show_shadow rs-sticky-default elementor-element elementor-element-a12073c e-con-full e-flex e-con e-child" data-id="a12073c" data-element_type="container" data-e-type="container">
            <div className="prelements-heading style1">
              <div className="title-inner">
                <h3 className="title rs-split-text-disable">Get in Touch</h3>
              </div>
            </div>

            <div className="wpcf7 js">
              {submitted ? (
                <div className="wpcf7-response-output" style={{ display: 'block', borderColor: '#46b450', color: '#46b450', padding: '12px 20px', marginTop: '10px' }}>
                  Message sent successfully! We will get back to you soon.
                </div>
              ) : (
                <form className="wpcf7-form" onSubmit={handleSubmit} noValidate>
                  <p>
                    <label>Your name<br />
                      <input
                        className="wpcf7-form-control wpcf7-text"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />
                    </label>
                  </p>
                  <p>
                    <label>Your email<br />
                      <input
                        className="wpcf7-form-control wpcf7-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        required
                      />
                    </label>
                  </p>
                  <p>
                    <label>Contact Number<br />
                      <input
                        className="wpcf7-form-control wpcf7-text"
                        type="text"
                        name="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        placeholder="Contact number"
                      />
                    </label>
                  </p>
                  <p>
                    <label>Your Company<br />
                      <input
                        className="wpcf7-form-control wpcf7-text"
                        type="text"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Company name"
                      />
                    </label>
                  </p>
                  <p>
                    <label>Your message (optional)<br />
                      <textarea
                        className="wpcf7-form-control wpcf7-textarea"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Your message..."
                      />
                    </label>
                  </p>
                  <p>
                    <input
                      className="wpcf7-form-control wpcf7-submit has-spinner"
                      type="submit"
                      value={submitting ? 'Sending...' : 'Submit'}
                      disabled={submitting}
                    />
                    {submitting && <span className="wpcf7-spinner"></span>}
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Maps column */}
          <div className="default no-position show_shadow rs-sticky-default elementor-element elementor-element-1b63907 e-con-full e-flex e-con e-child" data-id="1b63907" data-element_type="container" data-e-type="container">
            <div className="e-con-inner">
              <div className="elementor-element elementor-widget elementor-widget-google_maps">
                <div className="elementor-custom-embed">
                  <iframe
                    loading="lazy"
                    title="Rajkot - 408 RK Empire, Near Mavdi Circle, 150 Feet Ring Road, Rajkot 360004"
                    aria-label="Rajkot Office"
                    src="https://maps.google.com/maps?q=RK+Empire+Mavdi+Circle+150+Feet+Ring+Road+Rajkot+360004+Gujarat&output=embed&z=15"
                    style={{ border: 0, width: '100%', height: '300px' }}
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="elementor-element elementor-widget elementor-widget-google_maps" style={{ marginTop: '20px' }}>
                <div className="elementor-custom-embed">
                  <iframe
                    loading="lazy"
                    title="Vadodara Branch Office"
                    aria-label="Vadodara Office"
                    src="https://maps.google.com/maps?q=Vadodara+Gujarat+India&output=embed&z=13"
                    style={{ border: 0, width: '100%', height: '300px' }}
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
