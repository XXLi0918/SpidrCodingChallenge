import './App.css';
import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    airFryerCost: '',
    spidrPin: ''
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'spidrPin') {
      const digits = value.replace(/\D/g, '').slice(0, 16);
      formattedValue = digits;
    } else if (name === 'phoneNumber') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      if (digits.length > 6) {
        formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 3) {
        formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length > 0) {
        formattedValue = `(${digits}`;
      } else {
        formattedValue = '';
      }
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (formattedValue.trim() !== '') {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const errorMsg = validateField(name, formattedValue);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleMaskedPinKeyDown = (e) => {
    const key = e.key;
    if (key === 'Backspace') {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        spidrPin: prev.spidrPin.slice(0, -1)
      }));
    } else if (/^\d$/.test(key)) {
      e.preventDefault();
      if (formData.spidrPin.length < 16) {
        setFormData((prev) => ({
          ...prev,
          spidrPin: prev.spidrPin + key
        }));
      }
    }
  };

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const validateField = (name, value) => {
    if (!value.trim()) return 'Please fill out this field.';

    switch (name) {
      case 'firstName':
        return value.trim() ? '' : 'Please enter your first name.';
      case 'lastName':
        return value.trim() ? '' : 'Please enter your last name.';
      case 'email':
        return isEmail(value) ? '' : 'Please enter a valid email address.';
      case 'phoneNumber':
        return value.replace(/\D/g, '').length === 10
          ? ''
          : 'Please enter a valid phone number.';
      case 'spidrPin': {
          const realValue = formData.spidrPin;
          return realValue.length === 16
            ? ''
            : 'Please enter a 16-digit pin.';
      }
      case 'airFryerCost':
        return Number(value) >= 0 ? '' : 'Please enter a valid price.';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === 'spidrPin' && formData.spidrPin.length === 0) {
      return;
    }
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };


  const getInputClass = (name) => {
    return touched[name] && errors[name] ? 'field invalid' : 'field';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTouched = {};
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      newTouched[field] = true;
      newErrors[field] = validateField(field, formData[field]);
    });

    setTouched(newTouched);
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== '');
    if (hasError) {
      return;
    }

    console.log('Form Data:', {
      ...formData,
      spidrPin: formData.spidrPin.replace(/(\d{4})(?=\d)/g, '$1-') 
    });
    setSubmitted(true);
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      airFryerCost: '',
      spidrPin: ''
    });
    setTouched({});
    setErrors({});
  };

  return (
    <div className="App">
      <div className="form-container">
        {submitted ? (
          <div className="form-submitted">
            <h2>Form submitted!</h2>
            <p>Check console for data.</p>
            <button className="submit-btn" onClick={() => setSubmitted(false)}>
              Go Back
            </button>
          </div>
        ) : (
          <>
            <div className="form-header">
              <h2>Air Fryer Interest Form</h2>
              <p>Be the first to know about our revolutionary cooking appliance!</p>
            </div>

            <form onSubmit={handleSubmit} className="interest-form" noValidate>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder=" "
                    className={getInputClass('firstName')}
                  />
                  <label htmlFor="firstName">First Name</label>
                  {touched.firstName && errors.firstName && (
                    <span className="error-msg">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder=" "
                    className={getInputClass('lastName')}
                  />
                  <label htmlFor="lastName">Last Name</label>
                  {touched.lastName && errors.lastName && (
                    <span className="error-msg">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder=" "
                    className={getInputClass('phoneNumber')}
                  />
                  <label htmlFor="phoneNumber">Phone Number</label>
                  {touched.phoneNumber && errors.phoneNumber && (
                    <span className="error-msg">{errors.phoneNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder=" "
                    className={getInputClass('email')}
                  />
                  <label htmlFor="email">Email Address</label>
                  {touched.email && errors.email && (
                    <span className="error-msg">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="currency-input">
                  <input
                    type="number"
                    id="airFryerCost"
                    name="airFryerCost"
                    value={formData.airFryerCost}
                    onChange={handleInputChange}
                    required
                    placeholder=" "
                    className={getInputClass('airFryerCost')}
                  />
                  <label htmlFor="airFryerCost">Guess the Air Fryer's Cost</label>
                  <span className="currency-symbol">$</span>
                </div>
                  {touched.airFryerCost && errors.airFryerCost && (
                    <span className="error-msg">{errors.airFryerCost}</span>
                  )}
                </div>

                <div className="form-group">
                  <div className="pin-wrapper">
                    <input
                      type="text"
                      id="spidrPin"
                      name="spidrPin"
                      value={
                        showPin
                          ? formData.spidrPin.replace(/(\d{4})(?=\d)/g, '$1-')
                          : '#'.repeat(formData.spidrPin.length).replace(/(\#{4})(?=\#)/g, '$1-')
                      }
                      onChange={showPin ? handleInputChange : undefined}
                      onKeyDown={!showPin ? handleMaskedPinKeyDown : undefined}
                      onBlur={handleBlur}
                      required
                      autoComplete="off"
                      placeholder=" "
                      maxLength="19"
                      className={`${getInputClass('spidrPin')} ${!showPin ? 'masked-pin' : ''}`}
                      onCopy={(e) => !showPin && e.preventDefault()}
                      onPaste={(e) => !showPin && e.preventDefault()}
                      onCut={(e) => !showPin && e.preventDefault()}
                      readOnly={!showPin}
                    />
                    <label htmlFor="spidrPin">Secret 16-Digit Spidr PIN</label>
                    <span
                      className="toggle-pin-visibility"
                      onClick={() => setShowPin((prev) => !prev)}
                      role="button"
                    >
                      {showPin ? 'Hide Pin' : 'Show Pin'}
                    </span>
                  </div>

                  {touched.spidrPin && errors.spidrPin && (
                    <span className="error-msg">{errors.spidrPin}</span>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Submit Interest Form
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
