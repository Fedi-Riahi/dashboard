"use client"
import React, { useState, useEffect } from 'react';

const TrimForm = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
    const [year, setYear] = useState(0);
    const [consommationWLTP, setConsommationWLTP] = useState(0);
    const [emissions, setEmissions] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [fuelType, setFuelType] = useState('');
    const [cylinders, setCylinders] = useState(0);
    const [couple, setCouple] = useState(0);
    const [puissance, setPuissance] = useState(0);
    const [compression, setCompression] = useState('');
    const [maxSpeed, setMaxSpeed] = useState(0);
    const [acceleration, setAcceleration] = useState(0);
    const [length, setLength] = useState(0);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [driveType, setDriveType] = useState('');
    const [transmission, setTransmission] = useState('');
    const [transmissionType, setTransmissionType] = useState('');
    const [places, setPlaces] = useState('');
    const [doors, setDoors] = useState('');
    const [frontWheels, setFrontWheels] = useState('');
    const [rearWheels, setRearWheels] = useState('');
    const [PTAC, setPTAC] = useState(0);
    const [emptyWeight, setEmptyWeight] = useState('');
    const [maxCharge, setMaxCharge] = useState('');
    const [trailerWeight, setTrailerWeight] = useState(0);
    const [roofWeight, setRoofWeight] = useState('');
    const [trunkCapacity, setTrunkCapacity] = useState('');
    const [onDemand, setOnDemand] = useState(false);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/carmodels');
        if (response.ok) {
          const data = await response.json();
          setModels(data.carListing);
        } else {
          console.error('Failed to fetch car models');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);


  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: '',
    consommationWLTP: '',
    emissions: '',
    capacity: '',
    fuelType: '',
    cylinders: '',
    couple: '',
    puissance: '',
    compression: '',
    maxSpeed: '',
    acceleration: '',
    driveType: '',
    transmission: '',
    transmissionType: '',
    length: '',
    height: '',
    width: '',
    places: '',
    doors: '',
    frontWheels: '',
    rearWheels: '',
    PTAC: '',
    emptyWeight: '',
    maxCharge: '',
    trailerWeight: '',
    trunkCapacity: '',
    onDemand: false,
  });

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/trims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // Handle successful response
        console.log('Trim data submitted successfully!');
      } else {
        // Handle error response
        console.error('Failed to submit trim data');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" mx-auto bg-white p-5">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {step === 1 &&(
      <>

  <div className="col-span-3">
      <h3 className="text-lg font-bold mb-2">Trim Details</h3>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="name">Trim Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder='Classe A 250 4MATIC'
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="model">Model:</label>
      <select
      id="model"
      name="model"
      value={formData.model}
      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
      className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
      required
    >
        <option value="">Select Model</option>
        {loading ? (
          <option disabled>Loading models...</option>
        ) : (
          models.map(model => (
            <option key={model._id} value={model.model}>{model.listingTitle}</option>
          ))
        )}
      </select>
    </div>
   


    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="rearWheels">Year</label>
      <input
        type="text"
        id="year"
        name="year"
        value={formData.year}
        placeholder='2024'
         onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="flex items-center  ps-4 border border-gray-200 rounded dark:border-gray-700">
    <input
        type="checkbox"
        id="onDemand"
        name="onDemand"
        checked={formData.onDemand}
        onChange={(e) => setFormData({ ...formData, onDemand: e.target.checked })}
        className="w-4 h-4 text-zinc bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
      />

  <label
    htmlFor="bordered-checkbox-1"
    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  >
    On Demand
  </label>
</div>
    <div className="col-span-3">
      <h3 className="text-lg font-bold mb-2">Consommation and emission</h3>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="consommationWLTP">Consommation WLTP <span className='text-zinc/70'>( l/100km )</span></label>
      <input
        type="text"
        id="consommationWLTP"
        name="consommationWLTP"
        placeholder='6,8 - 5,9 '
        value={formData.consommationWLTP}
         onChange={(e) => setFormData({ ...formData, consommationWLTP: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="emissions">Emissions <span className='text-zinc/70'>( g/km )</span></label>
      <input
        type="text"
        id="emissions"
        name="emissions"
        value={formData.emissions}
         onChange={(e) => setFormData({ ...formData, emissions: e.target.value })}
        placeholder='178 - 154'
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="capacity">Capacity <span className='text-zinc/70'>( L )</span></label>
      <input
        type="text"
        id="capacity"
        name="capacity"
        value={formData.capacity}
        placeholder='65 / 8'
         onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="fuelType">Fuel Type</label>
      <input
        type="text"
        id="fuelType"
        name="fuelType"
        placeholder='Diesel'
        value={formData.fuelType}
         onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    </>
    )}
    {step === 2 &&(
      <>

    <div className="col-span-3">
      <h3 className="text-lg font-bold mb-2">Motorisation</h3>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="cylinders">Cylinders <span className='text-zinc/70'>( cc )</span></label>
      <input
        type="text"
        id="cylinders"
        name="cylinders"
        placeholder='2 989'
        value={formData.cylinders}
         onChange={(e) => setFormData({ ...formData, cylinders: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="couple">Couple <span className='text-zinc/70'>( Nm )</span></label>
      <input
        type="text"
        id="couple"
        name="couple"
        placeholder='650'
        value={formData.couple}
         onChange={(e) => setFormData({ ...formData, couple: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="puissance">Puissance <span className='text-zinc/70'>(  kW (ch) )</span></label>
      <input
        type="text"
        id="puissance"
        name="puissance"
        placeholder='230 kW (313 ch)'
        value={formData.puissance}
         onChange={(e) => setFormData({ ...formData, puissance: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="compression">Compression</label>
      <input
        type="text"
        id="compression"
        name="compression"
        value={formData.compression}
        placeholder='15.5'
         onChange={(e) => setFormData({ ...formData, compression: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="col-span-3">
      <h3 className="text-lg font-bold mb-2">Autonomie</h3>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="maxSpeed">Max Speed <span className='text-zinc/70'>( km/h )</span></label>
      <input
        type="text"
        id="maxSpeed"
        name="maxSpeed"
        placeholder='300'
        value={formData.maxSpeed}
         onChange={(e) => setFormData({ ...formData, maxSpeed: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="acceleration">Acceleration <span className='text-zinc/70'>( s/100km )</span></label>
      <input
        type="text"
        id="acceleration"
        name="acceleration"
        value={formData.acceleration}
        placeholder='5.6'
         onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="col-span-3">
      <h3 className="text-lg font-bold mb-2">Performance</h3>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="driveType">Drive Type</label>
      <input
        type="text"
        id="driveType"
        name="driveType"
        placeholder='4WD/AWD - FWD - RWD'
        value={formData.driveType}
         onChange={(e) => setFormData({ ...formData, driveType: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="transmission">Transmission</label>
      <input
        type="text"
        id="transmission"
        name="transmission"
        value={formData.transmission}
        placeholder='9 rapports 9G-TRONIC'
         onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="transmissionType">Transmission Type</label>
      <input
        type="text"
        id="transmissionType"
        name="transmissionType"
        value={formData.transmissionType}
        placeholder='Automatic'
         onChange={(e) => setFormData({ ...formData, transmissionType: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    </>
    )}
    {step === 3 &&(
      <>

    <div className="col-span-3">
      <h3 className="text-lg font-bold mb-2">Dimensions</h3>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="length">Length <span className='text-zinc/70'>( mm )</span></label>
      <input
        type="text"
        id="length"
        name="length"
        value={formData.length}
        placeholder='5 179'
         onChange={(e) => setFormData({ ...formData, length: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="height">Height <span className='text-zinc/70'>( mm )</span></label>
      <input
        type="text"
        id="height"
        name="height"
        placeholder='1 503'
        value={formData.height}
         onChange={(e) => setFormData({ ...formData, height: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="width">Width <span className='text-zinc/70'>( mm )</span></label>
      <input
        type="text"
        id="width"
        name="width"
        value={formData.width}
        placeholder='2 109'
         onChange={(e) => setFormData({ ...formData, width: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="col-span-3">
      <h3 className="text-lg font-bold mb-2">Chassis</h3>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="places">Places</label>
      <input
        type="text"
        id="places"
        name="places"
        placeholder='5'
        value={formData.places}
         onChange={(e) => setFormData({ ...formData, places: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="doors">Doors</label>
      <input
        type="text"
        id="doors"
        name="doors"
        placeholder='4'
        value={formData.doors}
         onChange={(e) => setFormData({ ...formData, doors: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="col-span-3">
      <h3 className="text-lg font-bold mb-2">Wheels</h3>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="frontWheels">Front Wheels</label>
      <input
        type="text"
        id="frontWheels"
        name="frontWheels"
        placeholder='235/55 R18'
        value={formData.frontWheels}
         onChange={(e) => setFormData({ ...formData, frontWheels: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="rearWheels">Rear Wheels</label>
      <input
        type="text"
        id="rearWheels"
        name="rearWheels"
        placeholder='235/55 R18'
        value={formData.rearWheels}
         onChange={(e) => setFormData({ ...formData, rearWheels: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    </>
    )}

    {step === 4 &&(
      <>
    <div className="col-span-3">
      <h3 className="text-lg font-bold mb-2">Weight</h3>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="PTAC">P.T.A.C <span className='text-zinc/70'>( kg )</span></label>
      <input
        type="text"
        id="PTAC"
        name="PTAC"
        value={formData.PTAC}
         onChange={(e) => setFormData({ ...formData, PTAC: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="emptyWeight">Empty Weight <span className='text-zinc/70'>( kg )</span></label>
      <input
        type="text"
        id="emptyWeight"
        name="emptyWeight"
        value={formData.emptyWeight}
         onChange={(e) => setFormData({ ...formData, emptyWeight: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="maxCharge">Max Charge <span className='text-zinc/70'>( kg )</span></label>
      <input
        type="text"
        id="maxCharge"
        name="maxCharge"
        value={formData.maxCharge}
         onChange={(e) => setFormData({ ...formData, maxCharge: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="trailerWeight">Trailer Weight <span className='text-zinc/70'>( kg )</span></label>
      <input
        type="text"
        id="trailerWeight"
        name="trailerWeight"
        value={formData.trailerWeight}
         onChange={(e) => setFormData({ ...formData, trailerWeight: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" htmlFor="trunkCapacity">Trunk Capacity <span className='text-zinc/70'>( L )</span></label>
      <input
        type="text"
        id="trunkCapacity"
        name="trunkCapacity"
        value={formData.trunkCapacity}
         onChange={(e) => setFormData({ ...formData, trunkCapacity: e.target.value })}
        className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        required
      />
    </div>
    </>
    )}
  </div>
  {/* Navigation buttons */}
  {step !== 1 && (
    <button
      type="button"
      onClick={handlePreviousStep}
      className="mt-4 mr-4  px-8 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc hover:bg-zinc/[0.9] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
      >
      Previous
      </button>
        )}
        {step !== 4 && (
          <button
            type="button"
            onClick={handleNextStep}
            className="mt-3 px-8 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc hover:bg-zinc/[0.9] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            Next
          </button>
        )}
        {step === 4 && (
        <button type="submit" className="mt-3 px-8 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc hover:bg-zinc/[0.9] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
          Submit
        </button>
        )}
</form>

  );
};

export default TrimForm;
