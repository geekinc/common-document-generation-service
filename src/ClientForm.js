// src/ClientForm.js
import React, { useState } from 'react';
import { Accordion, Card, Button, Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import CurrencyInput from 'react-currency-input-field';
import { ToastContainer, toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faRemove } from '@fortawesome/free-solid-svg-icons'
import { faArrowsH } from '@fortawesome/free-solid-svg-icons'

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';


import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import _ from "underscore";

const ClientForm = () => {
    const [profileDescription, setProfileDescription] = React.useState('testing');
    const [profileState, setProfileState] = React.useState('testing');
    const [profileJobTitles, setProfileJobTitles] = React.useState([]);
    const [profileLocations, setProfileLocations] = React.useState([]);
    const [profileIndustries, setProfileIndustries] = React.useState([]);
    const [profileEmployeeCounts, setProfileEmployeeCounts] = React.useState([]);
    const [profileRevenueMin, setProfileRevenueMin] = React.useState('0');
    const [profileRevenueMax, setProfileRevenueMax] = React.useState('0');
    const [profileTag, setProfileTag] = React.useState('');
    const [profileFrequencyCount, setProfileFrequencyCount] = React.useState(0);
    const [profileFrequency, setProfileFrequency] = React.useState('day');
    const [icpRows, setIcpRows] = React.useState([]);


    const _ = require('underscore');

    let jobTitles = require('./data/jobTitles.json');
    jobTitles = _.uniq(jobTitles, 'name');
    jobTitles = jobTitles.sort((a, b) => {
        if (a.name.length < b.name.length) {
            return -1;
        }
    });

    // Set up static locations array
    let locations = require('./data/locations.json');
    locations = _.uniq(locations, 'name');
    locations = locations.sort((a, b) => {
        if (a.name.length < b.name.length) {
            return -1;
        }
    });

    let industries = require('./data/industries.json');
    industries = _.uniq(industries, 'name');
    industries = industries.sort((a, b) => {
        if (a.name.length < b.name.length) {
            return -1;
        }
    });

    let employees = ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001-2000', '2001-5000', '5001-10000', '10001+'];

    const columns = [
        {
            field: 'hydratorName',
            headerName: 'Name',
            type: 'string',
            flex: 1
        },
        {
            field: 'state',
            headerName: 'State',
            type: 'string',
            flex: 1
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.5,
            renderCell: (params) => (
                <strong>
                    <Button
                        variant="contained"
                        size="small"
                        tabIndex={params.hasFocus ? 0 : -1}
                        className="btn btn-primary btn-sm"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        tabIndex={params.hasFocus ? 0 : -1}
                        onClick={(e) => handleRemoveProfileClick(e)}
                        className="btn btn-primary btn-sm"
                    >
                        <FontAwesomeIcon icon={faRemove} />
                    </Button>
                </strong>
            ),
        },
    ];

    let rows = [
        { id: 1, hydratorName: 'North American Prospects', state: 'Testing', lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, hydratorName: 'Safety Managers', state: 'Testing', lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, hydratorName: 'Experiment', state: 'Testing', lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    ];

    const handleProfileDescriptionChange = (data) => {
        setProfileDescription(data);
    };

    const handleProfileStateChange = (event, newState) => {
        if (newState !== null) {
            setProfileState(newState);
        }
    };

    const handleProfileJobTitlesChange = (event, data) => {
        setProfileJobTitles(data);
    };

    const handleProfileLocationsChange = (event, data) => {
        setProfileLocations(data);
    };

    const handleProfileIndustriesChange = (event, data) => {
        setProfileIndustries(data);
    };

    const handleProfileEmployeeCountsChange = (event, data) => {
        setProfileEmployeeCounts(data);
    };

    const handleProfileRevenueMinChange = (data) => {
        setProfileRevenueMin(data);
    };

    const handleProfileRevenueMaxChange = (data) => {
        setProfileRevenueMax(data);
    };

    const handleProfileTagChange = (data) => {
        setProfileTag(data);
    };

    const handleProfileFrequencyChange = (event, data) => {
        if (data !== null) {
            setProfileFrequency(data);
        }
    };

    const handleProfileFrequencyCountChange = (data) => {
        setProfileFrequencyCount(data);
    };

    const handleAddClick = (event) => {
        setIcpRows([...icpRows, { id: 4, hydratorName: 'This is a test of the emergency', state: 'Testing', lastName: 'Lannister', firstName: 'Jaime', age: 45 }]);
    };

    const handleRemoveProfileClick = (event) => {
        console.log(event);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            // setIsLoading(true);
            // const response = await fetch('https://ty9vcdxik7.execute-api.us-east-1.amazonaws.com/prod/api/search', {
            // const response = await fetch('http://localhost:3000/dev/api/search', {
            // const response = await fetch('http://localhost:3000/dev/api/local-search', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });
            // const data = await response.json();

            const queryParameters = new URLSearchParams(window.location.search);
            let customer = queryParameters.get("customer") || '123456789';
            let query ={
                icp_name: profileDescription,
                state: profileState,
                customer: customer,
                person_titles: profileJobTitles,
                person_locations : profileLocations,
                organization_num_employees_ranges: profileEmployeeCounts,
                contact_email_status: ["verified"],
                revenue_range: {"max": profileRevenueMax, "min": profileRevenueMin},
                organization_industry_tag_ids: profileIndustries,
                frequency: {"count": profileFrequencyCount, "period": profileFrequency},
                tag: profileTag,
                per_page: 200,
                page: 1
            }

            console.log(query);

            // setIsLoading(false);
            // setResults(data);  // set the results state with the data received
            // setTotalEntries(extractTotalEntries(data));
        } catch (error) {
            console.error('Error:', error);
            // setIsLoading(false);
        }
    };

    return (
        <section data-v-029f7e9f="" id="agency_location" className="hl_wrapper--inner hl_agency hl_agency-location--details" style={{backgroundColor: "#f2f7fa"}}>
            <div data-v-029f7e9f="" className="container-fluid">
                <div data-v-029f7e9f="" className="mt-3">

                </div>
                <div data-v-029f7e9f="" className="row">
                    <div data-v-029f7e9f="" className="col-lg-6">
                        <div data-v-029f7e9f="" className="card">
                            <div data-v-029f7e9f="" className="card-header">
                                <h2 data-v-029f7e9f="">Ideal Customer Profile (ICP)</h2>
                                <div>
                                    <button data-v-029f7e9f="" type="button" className="btn btn-secondary btn-sm">Cancel</button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button data-v-029f7e9f="" type="button" className="btn btn-primary btn-sm">Save</button>
                                </div>
                            </div>
                            <div data-v-029f7e9f="" className="card-body">
                                <Form onSubmit={handleFormSubmit}  className="">
                                <div data-v-029f7e9f="" className="tab-content">
                                    <div data-v-029f7e9f="" id="prospect" role="tabpanel" aria-labelledby="prospect-tab" className="tab-pane fade show active" style={{padding: "0px"}}>
                                        <div style={{padding: "15px"}}>


                                            <div className="form-group">
                                                <span data-v-56639245="" className="text-sm font-medium text-gray-700">
                                                    ICP Description
                                                </span>
                                                <div data-v-7d86ee8a="" className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1" data-lpignore="true" autoComplete="msgsndr1" data-vv-as="revenue">
                                                    <input data-v-7d86ee8a="" value={profileDescription} onChange={e => handleProfileDescriptionChange(e.target.value)} type="text" data-lpignore="true" autoComplete="msgsndr1" placeholder="Short description of your Ideal Customer Profile" className="hl-text-input shadow-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 block w-full sm:text-sm border-gray-300 rounded disabled:opacity-50 text-gray-800" name="msgsndr1" maxLength="" />

                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <span data-v-56639245="" className="text-sm font-medium text-gray-700">
                                                    Profile State
                                                </span>
                                                <div data-v-7d86ee8a="" className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1" data-lpignore="true" autoComplete="msgsndr1" data-vv-as="revenue">
                                                    <ToggleButtonGroup
                                                        color="primary"
                                                        value={profileState}
                                                        exclusive
                                                        size="small"
                                                        onChange={handleProfileStateChange}
                                                        aria-label="profileState"
                                                    >
                                                        <ToggleButton value="testing">Testing</ToggleButton>
                                                        <ToggleButton value="offline">Offline</ToggleButton>
                                                        <ToggleButton value="active">Active</ToggleButton>
                                                    </ToggleButtonGroup>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div data-v-7d86ee8a="" className="hl-text-input-container msgsndr5" data-lpignore="true" data-vv-as="Job title">
                                                    <div data-v-7d86ee8a="" className="flex space-x-3">
                                                        <span data-v-7d86ee8a="" htmlFor="msgsndr5" className="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">Job Title</span>
                                                    </div>
                                                    <div data-v-7d86ee8a="" className="relative rounded-md shadow-sm">
                                                        <Autocomplete
                                                            multiple
                                                            limitTags={2}
                                                            id="multiple-limit-tags"
                                                            options={jobTitles}
                                                            value={profileJobTitles}
                                                            onChange={handleProfileJobTitlesChange}
                                                            getOptionLabel={(option) => option.name}
                                                            defaultValue={[]}
                                                            className="w-full"
                                                            renderInput={(params) => (
                                                                <TextField {...params} className="input-no-shadow"  label="" placeholder="" />
                                                            )}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div data-v-7d86ee8a="" className="hl-text-input-container msgsndr6" data-lpignore="true" data-vv-as="Location">
                                                    <div data-v-7d86ee8a="" className="flex space-x-3">
                                                        <span data-v-7d86ee8a="" htmlFor="msgsndr6" className="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">Location(s)</span>
                                                    </div>
                                                    <Autocomplete
                                                        multiple
                                                        limitTags={2}
                                                        id="multiple-limit-tags"
                                                        options={locations}
                                                        value={profileLocations}
                                                        onChange={handleProfileLocationsChange}
                                                        getOptionLabel={(option) => option.name}
                                                        defaultValue={[]}
                                                        className="w-full"
                                                        renderInput={(params) => (
                                                            <TextField {...params} className="input-no-shadow"  label="" placeholder="" />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div data-v-7d86ee8a="" className="hl-text-input-container msgsndr6" data-lpignore="true" data-vv-as="Location">
                                                    <div data-v-7d86ee8a="" className="flex space-x-3">
                                                        <span data-v-7d86ee8a="" htmlFor="msgsndr6" className="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">Industry</span>
                                                    </div>
                                                    <Autocomplete
                                                        multiple
                                                        limitTags={2}
                                                        id="multiple-limit-tags"
                                                        options={industries}
                                                        value={profileIndustries}
                                                        onChange={handleProfileIndustriesChange}
                                                        getOptionLabel={(option) => option.name}
                                                        defaultValue={[]}
                                                        className="w-full"
                                                        renderInput={(params) => (
                                                            <TextField {...params} className="input-no-shadow"  label="" placeholder="" />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div data-v-7d86ee8a="" className="hl-text-input-container msgsndr6" data-lpignore="true" data-vv-as="Location">
                                                    <div data-v-7d86ee8a="" className="flex space-x-3">
                                                        <span data-v-7d86ee8a="" htmlFor="msgsndr6" className="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">Number of Employees</span>
                                                    </div>
                                                    <Autocomplete
                                                        multiple
                                                        limitTags={2}
                                                        id="multiple-limit-tags"
                                                        options={employees}
                                                        value={profileEmployeeCounts}
                                                        onChange={handleProfileEmployeeCountsChange}
                                                        getOptionLabel={(option) => option}
                                                        defaultValue={[]}
                                                        className="w-full"
                                                        renderInput={(params) => (
                                                            <TextField {...params} className="input-no-shadow"  label="" placeholder="" />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <span data-v-56639245="" className="text-sm font-medium text-gray-700">
                                                    Company Revenue
                                                </span>
                                                <div data-v-7d86ee8a="" className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1" data-lpignore="true" autoComplete="msgsndr1" data-vv-as="revenue">
                                                    <div data-v-7d86ee8a="" className="flex space-x-3">

                                                    </div>
                                                    <div data-v-7d86ee8a="" className="relative rounded-md">
                                                        <div className="input-group">
                                                            <div className="input-group col-md-5">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">$</span>
                                                                </div>
                                                                <input type="text" value={profileRevenueMin} onChange={e => handleProfileRevenueMinChange(e.target.value)} style={{ fontSize: "0.875rem", lineHeight: "1.25rem"}} className="form-control sm:text-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 border-gray-300 disabled:opacity-50 text-gray-800" aria-label="Amount (to the nearest dollar)" />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text">.00</span>
                                                                </div>
                                                            </div>
                                                            <span className="input-group-addon col-md-2 center"> <FontAwesomeIcon icon={faArrowsH} style={{position:"relative", top: "5px"}}/> </span>
                                                            <div className="input-group col-md-5">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">$</span>
                                                                </div>
                                                                <input type="text" value={profileRevenueMax} onChange={e => handleProfileRevenueMaxChange(e.target.value)} style={{ fontSize: "0.875rem", lineHeight: "1.25rem"}} className="form-control sm:text-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 border-gray-300 disabled:opacity-50 text-gray-800" aria-label="Amount (to the nearest dollar)" />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text">.00</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <span data-v-56639245="" className="text-sm font-medium text-gray-700">
                                                    Prospect Tag
                                                </span>
                                                <div data-v-7d86ee8a="" className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1" data-lpignore="true" autoComplete="msgsndr1" data-vv-as="revenue">
                                                    <div data-v-7d86ee8a="" className="flex space-x-3">

                                                    </div>
                                                    <div data-v-7d86ee8a="" className="relative rounded-md shadow-sm">
                                                        <input data-v-7d86ee8a="" value={profileTag} onChange={e => handleProfileTagChange(e.target.value)} type="text" data-lpignore="true" autoComplete="msgsndr1" placeholder="Tag Added to Prospect" className="hl-text-input shadow-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 block w-full sm:text-sm border-gray-300 rounded disabled:opacity-50 text-gray-800" name="msgsndr1" maxLength="" />

                                                    </div>

                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <span data-v-56639245="" className="text-sm font-medium text-gray-700">
                                                    Hydration Frequency
                                                </span>
                                                <div data-v-7d86ee8a="" className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1" data-lpignore="true" autoComplete="msgsndr1" data-vv-as="revenue">
                                                    <TextField
                                                        type="number"
                                                        id="outlined-basic"
                                                        size="small"
                                                        onChange={(e) => handleProfileFrequencyCountChange(e.target.value)}
                                                        value={profileFrequencyCount}
                                                    />

                                                    <span style={{paddingLeft: '1rem', paddingRight: '1rem'}}>per</span>

                                                    <ToggleButtonGroup
                                                        color="primary"
                                                        exclusive
                                                        size="small"
                                                        value={profileFrequency}
                                                        onChange={handleProfileFrequencyChange}
                                                        aria-label="profileState"
                                                    >
                                                        <ToggleButton value="day">Day</ToggleButton>
                                                        <ToggleButton value="weekday">Weekday</ToggleButton>
                                                        <ToggleButton value="week">Week</ToggleButton>
                                                        <ToggleButton value="month">Month</ToggleButton>
                                                    </ToggleButtonGroup>
                                                </div>
                                            </div>

                                        </div>

                                        <button data-v-029f7e9f="" type="submit" className="btn btn-primary float-right">Test Now</button>
                                    </div>

                                </div>
                                </Form>
                            </div>


                        </div>
                    </div>
                    <div data-v-029f7e9f="" className="col-lg-6">
                        <div data-v-029f7e9f="" className="card">
                            <div data-v-029f7e9f="" className="card-header">
                                <h2 data-v-029f7e9f="">Stored Profiles</h2>
                                <button data-v-029f7e9f="" type="button" className="btn btn-primary btn-sm" onClick={handleAddClick}>+</button>
                            </div>
                            <div data-v-029f7e9f="" className="card-body">
                                <div data-v-8f0d508e="" data-v-029f7e9f="" className="tab-content">
                                    <div data-v-8f0d508e="" id="note" role="tabpanel" aria-labelledby="note-tab" className="tab-pane fade show active">
                                        <div data-v-8f0d508e="" className="form-group">
                                            <div data-v-89f68d3c="" data-v-8f0d508e="" className="">
                                                {icpRows.length > 0 &&
                                                    <DataGrid
                                                        rows={icpRows}
                                                        columns={columns}
                                                        initialState={{
                                                            pagination: {
                                                                paginationModel: {
                                                                    pageSize: 10,
                                                                },
                                                            },
                                                        }}
                                                        pageSizeOptions={[10]}
                                                        disableRowSelectionOnClick
                                                    />
                                                }
                                                {icpRows.length === 0 &&
                                                    <div>No stored profiles</div>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                        {/*<div data-v-029f7e9f="" className="card">*/}
                        {/*    <div data-v-029f7e9f="" className="card-header">*/}
                        {/*        <h2 data-v-029f7e9f="">Activity</h2>*/}
                        {/*    </div>*/}
                        {/*    <div data-v-029f7e9f="" className="card-body">*/}
                        {/*        <ul data-v-029f7e9f="" role="tablist" className="nav nav-tabs activity-tab">*/}
                        {/*            <li data-v-029f7e9f="" className="nav-item"><a data-v-029f7e9f="" id="note-tab" data-toggle="tab" href="#note" role="tab" aria-controls="note" aria-selected="false" className="nav-link active">Details</a></li>*/}
                        {/*        </ul>*/}
                        {/*        <div data-v-8f0d508e="" data-v-029f7e9f="" className="tab-content">*/}
                        {/*            <div data-v-8f0d508e="" id="note" role="tabpanel" aria-labelledby="note-tab" className="tab-pane fade show active">*/}
                        {/*                <div data-v-8f0d508e="" className="form-group">*/}
                        {/*                    <div data-v-89f68d3c="" data-v-8f0d508e="" className="">*/}

                        {/*                        <div data-v-89f68d3c="" className="mt-1 relative rounded-md shadow-sm">*/}
                        {/*                            <textarea data-v-2cb46869="" data-v-89f68d3c="" placeholder="Enter note" name="note" className="hl-text-area-input  text-gray-800 shadow-sm block w-full focus:outline-none focus:ring-offset-curious-blue-500 focus:border-curious-blue-500 sm:text-sm border-gray-300 rounded-md disabled:opacity-50" rows="4" type="text" maxLength=""></textarea>*/}

                        {/*                        </div>*/}

                        {/*                    </div>*/}
                        {/*                </div>*/}

                        {/*            </div>*/}
                        {/*        </div>*/}

                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default ClientForm;
