import React from 'react';
import { useState } from 'react';
const OnboardingModal = ({ setDisplayOnboarding }) => {
  const handleNext = () => {
    setStep(prevStep => prevStep + 1);
  };

  const [currentStep, setStep] = useState(1);

  let content;
  if (currentStep === 1) {
    content = (
      <>
        <h3>Step 1/6</h3>
        <h2>Customize Spin Wheel</h2>
        <div className='onboarding-img-container'>
          <img className='onboarding-img' src="/steps1_6.png" alt="Onboarding step 1" />
        </div>
        <h5 className='onboarding-h5'>Add Entries</h5>
        <p className='onboarding-p'>Type in the name and probability of the item. Probabilities must be divisible by 10 or 25. Total probability needs to equal 100.</p>
        <h5 className='onboarding-h5'>Delete Entries</h5>
        <p className='onboarding-p'>You can click the delete entry button to remove elements.</p>
        <h5 className='onboarding-h5'>Save Entries</h5>
        <p className='onboarding-p'>To save your changes to the wheel, click save.</p>
      </>
    );
  } else if (currentStep === 2) {
    content = (
      <>
        <h3>Step 2/6</h3>
        <h2>Add Your Business Name</h2>
        <div className='onboarding-img-container'>
          <img className='onboarding-img'  src="/steps2_6.png" alt="Onboarding step 1" />
        </div>
        <h5 className='onboarding-h5'>Add Business Name</h5>
        <p className='onboarding-p'>Go to the info tab and type in your business name. This Name will apper on your spin wheel.</p>
      </>
    );
  } // Add additional steps as needed

  else if (currentStep === 3) {
    content = (
      <>
        <h3>Step 3/6</h3>
        <h2>QR Code</h2>
        <div className='onboarding-img-container'>
          <img className='onboarding-img'  src="/steps3_6.png" alt="Onboarding step 1" />
        </div>
        <h5 className='onboarding-h5'>QR Code</h5>
        <p className='onboarding-p'>A QR code will be generated that clients can scan to access your user for and spin your wheel.</p>
        <h5 className='onboarding-h5'>Download</h5>
        <p className='onboarding-p'>Download your QR code and display it for clients to scan.</p>
      </>
    );
  } // Add additional steps as needed

  else if (currentStep === 4) {
    content = (
      <>
        <h3>Step 4/6</h3>
        <h2>Collected Emails</h2>
        <div className='onboarding-img-container'>
          <img className='onboarding-img'  src="/steps4_6.png" alt="Onboarding step 1" />
        </div>
        <h5 className='onboarding-h5'>View Collected Emails</h5>
        <p className='onboarding-p'>Go on the email tab and view the emails you have collected via your user form.</p>
        <h5 className='onboarding-h5'>Export Emails</h5>
        <p className='onboarding-p'>Download your collected emails as an excel sheet by clicking the export button.</p>
      </>
    );
  } // Add additional steps as needed

  else if (currentStep === 5) {
    content = (
      <>
        <h3>Step 5/6</h3>
        <h2>Analytics</h2>
        <div className='onboarding-img-container'>
          <img className='onboarding-img'  src="/steps5_6.png" alt="Onboarding step 1" />
        </div>
        <h5 className='onboarding-h5'>View Data</h5>
        <p className='onboarding-p'>Click on the charts tab and view the number of emails you have collected over time.</p>
      </>
    );
  } // Add additional steps as needed

  else if (currentStep === 6) {
    content = (
      <>
        <h3>Step 6/6</h3>
        <h2>User Form</h2>
        <div className='onboarding-img-container'>
          <img className='onboarding-img'  src="/steps6_6.png" alt="Onboarding step 1" />
        </div>
        <h5 className='onboarding-h5'>View User Form</h5>
        <p className='onboarding-p'>The user form will be what the client sees when they scan your QR code. View what they'll see by clicking on the User Form tab.</p>
        <h5 className='onboarding-h5'>Email Confirmation</h5>
        <p className='onboarding-p'>An email will be sent to the client with they prize they've won. Ask the client to show you the email for proof that they typed it in.</p>
      </>
    );
  } // Add additional steps as needed

  if (currentStep === 7) {
    setDisplayOnboarding(false)
  }

  return (
    <div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex:5000 }}>
        <div className='center'>
          {content}
          <div className='onboarding-button-container'>
            <button className='onboarding-button' onClick={handleNext}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
