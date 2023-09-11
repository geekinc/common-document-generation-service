// src/ClientForm.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit, faRefresh} from '@fortawesome/free-solid-svg-icons'
import { faArrowsH } from '@fortawesome/free-solid-svg-icons'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import _ from "underscore";

import './App.css';

// const API_URL = 'http://localhost:3000/dev';
const API_URL = 'https://4btojh14c6.execute-api.us-east-1.amazonaws.com/prod';

const ClientForm = () => {

    //  variable declarations ------------------------------------------------------------------------------------------
    const blankProfile = {
        id: '',
        new: false,
        customer: '',
        description: '',
        state: 'editing',
        jobTitles: [],
        locations: [],
        industries: [],
        employeeCounts: [],
        revenueMin: '0',
        revenueMax: '0',
        tag: '',
        frequencyCount: 0,
        frequency: 'day'
    }
    const [var_editing, set_editing] = useState(-1);
    const [customer, setCustomer] = React.useState('');
    const [profile, setProfile] = React.useState(blankProfile);
    const [profiles, setProfiles] = React.useState([]);
    const [jobTitles, setJobTitles] = React.useState([]);
    const [locations, setLocations] = React.useState([]);
    const [industries, setIndustries] = React.useState([]);
    const [employees, setEmployees] = React.useState([]);

    const [searchResponse, setSearchResponse] = React.useState(null);

    // modal variables
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setSearchResponse(null);
    }
    const handleShow = () => setShow(true);

    //  event listeners ------------------------------------------------------------------------------------------------

    // Run on page load
    useEffect( ()=> {
        // Determine which customer this impacts
        const queryParameters = new URLSearchParams(window.location.search);
        let id = queryParameters.get("customer");
        if(typeof(id) !== 'string') {
            setCustomer('');
        } else {
            setCustomer(id);
        }

        // Fetch the job titles
        let jobs = require('./data/jobTitles.json');
        jobs = _.uniq(jobs, 'name');
        jobs = jobs.sort((a, b) => {
            if (a.name.length < b.name.length) {
                return -1;
            }
            return 1;
        });
        setJobTitles(jobs.map(job => job.name));

        // Fetch locations
        let locales = require('./data/locations.json');
        locales = _.uniq(locales, 'name');
        locales = locales.sort((a, b) => {
            if (a.name.length < b.name.length) {
                return -1;
            }
            return 1;
        });
        setLocations(locales.map(locale => locale.name));

        // Fetch industries
        let verticals = require('./data/industries.json');
        verticals = _.uniq(verticals, 'name');
        verticals = verticals.sort((a, b) => {
            if (a.name.length < b.name.length) {
                return -1;
            }
            return 1;
        });
        setIndustries(verticals.map(vertical => vertical.name));

        // Fetch employees
        setEmployees([
            '1-10',
            '11-20',
            '21-50',
            '51-100',
            '101-200',
            '201-500',
            '501-1000',
            '1001-2000',
            '2001-5000',
            '5001-10000',
            '10001+'
        ]);

    },[]);

    // Kick off the API calls once we have a customer id
    useEffect( ()=> {
        // Fetch the stored profiles
        console.log(customer);
        API_get_profiles().then((data) => {
            if (data.length > 0) {
                setProfiles(data);
            }
        });
    },[customer]);


    //  API calls ------------------------------------------------------------------------------------------------------

    async function API_get_profiles(){
        localStorage.setItem('activetime',Math.floor(Date.now() / 1000));
        let data = [];
        try {
            const response = await fetch(API_URL + '/stored-profile/' + customer, {
                method: 'GET'
            });
            console.log(response);
            if (response.status === 404) {
                console.log('404 error');
            } else {
                data = await response.json()
            }
        } catch (e) {
            data = [];
        }
        return data;
    }

    async function API_search_prospects(payload){
        localStorage.setItem('activetime',Math.floor(Date.now() / 1000));
        let data = [];
        try {
            const response = await fetch(API_URL + '/search-prospects', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            console.log(response);

            if (response.status === 404) {
                console.log('404 error');
            } else {
                data = await response.json()
            }
        } catch (e) {
            console.error(e);
            data = [];
        }

        setSearchResponse(data);
        return data;
    }


    //  event functions ------------------------------------------------------------------------------------------------

    const handleProfileDescriptionChange = (data) => {
        setProfile({ ...profile, description: data });
    };

    const handleProfileStateChange = (event, newState) => {
        if (newState !== null) {
            setProfile({ ...profile, state: newState });
        }
    };

    const handleProfileJobTitlesChange = (event, data) => {
        setProfile({ ...profile, jobTitles: data });
    };

    const handleProfileLocationsChange = (event, data) => {
        setProfile({ ...profile, locations: data });
    };

    const handleProfileIndustriesChange = (event, data) => {
        setProfile({ ...profile, industries: data });
    };

    const handleProfileEmployeeCountsChange = (event, data) => {
        setProfile({ ...profile, employeeCounts: data });
    };

    const handleProfileRevenueMinChange = (data) => {
        setProfile({ ...profile, revenueMin: data });
    };

    const handleProfileRevenueMaxChange = (data) => {
        setProfile({ ...profile, revenueMax: data });
    };

    const handleProfileTagChange = (data) => {
        setProfile({ ...profile, tag: data });
    };

    const handleProfileFrequencyChange = (event, data) => {
        if (data !== null) {
            setProfile({ ...profile, frequency: data });
        }
    };

    const handleProfileFrequencyCountChange = (data) => {
        setProfile({ ...profile, frequencyCount: data });
    };

    const handleAddClick = (event) => {
        if (var_editing >= 0) {
            let shouldContinue = window.confirm("You will lose any unsaved changes.  Are you sure you want to continue?");
            if (!shouldContinue) {
                return;
            }
        }

        // Load the blank values into the working state variables
        let localProfile = blankProfile;
        localProfile.new = true;
        setProfile(localProfile);

        // Need to add indexing to highlight the new entry
        set_editing(true);
        // setProfiles([...profiles, blankProfile]);
    };

    function refreshData() {
        setProfile(blankProfile);
        set_editing(-1);
        API_get_profiles().then((data) => {
            if (data.length > 0) {
                setProfiles(data);
            }
        });
    }

    const handleRefreshClick = (event) => {
        if (var_editing >= 0) {
            let shouldContinue = window.confirm("You will lose any unsaved changes.  Are you sure you want to continue?");
            if (!shouldContinue) {
                return;
            }
        }
        refreshData();
    };

    const handleCloseClick = (event) => {
        let shouldContinue = window.confirm("You will lose any unsaved changes.  Are you sure you want to continue?");
        if (!shouldContinue) {
            return;
        }
        setProfile(blankProfile);
        set_editing(-1);
    }

    const handleEditProfileClick = (event, index) => {

        // Load the saved values into the working state variables
        let localProfile = profiles[index];
        localProfile.jobTitles = (localProfile.job_title !== "") ? localProfile.job_title.split('|') : [];
        localProfile.locations = (localProfile.location !== "") ? localProfile.location.split('|') : [];
        localProfile.industries = (localProfile.industry !== "") ? localProfile.industry.split('|') : [];
        localProfile.employeeCounts = (localProfile.number_of_employees !== "") ? localProfile.number_of_employees.split('|') : [];
        localProfile.revenueMin = (localProfile.company_revenue_min !== "") ? localProfile.company_revenue_min : '0';
        localProfile.revenueMax = (localProfile.company_revenue_max !== "") ? localProfile.company_revenue_max : '0';
        localProfile.frequencyCount = (localProfile.hydration_frequency !== "") ? localProfile.hydration_frequency : 0;
        localProfile.frequency = (localProfile.hydration_period !== "") ? localProfile.hydration_period : 'day';
        localProfile.tag = (localProfile.prospect_tag !== "") ? localProfile.prospect_tag : '';
        setProfile(localProfile);

        set_editing(index);
    };

    const processEmployeeCounts = (data) => {
        let result = [];
        if (data !== null) {
            result = data.map((item) => {
                return item.toString().replace('-', ',');
            });
        }
        return result;
    };

    const handleTestClick = (event) => {
        // Trigger the test
        let payload = {
            id: profile.id,
            customer: customer,
            description: profile.description,
            state: profile.state,
            job_title: profile.jobTitles,
            location: profile.locations,
            industry: profile.industries,
            number_of_employees: processEmployeeCounts(profile.employeeCounts),
            company_revenue_min: profile.revenueMin,
            company_revenue_max: profile.revenueMin,
            prospect_tag: profile.tag,
            hydration_frequency: profile.frequencyCount,
            hydration_period: profile.frequency
        };

        // Apply the search
        API_search_prospects(payload);

        // Show modal
        setShow(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        set_editing(-1);
        try {
            let payload = {
                id: profile.id,
                customer: customer,
                description: profile.description,
                state: profile.state,
                job_title: profile.jobTitles,
                location: profile.locations,
                industry: profile.industries,
                number_of_employees: profile.employeeCounts,
                company_revenue_min: profile.revenueMin,
                company_revenue_max: profile.revenueMin,
                prospect_tag: profile.tag,
                hydration_frequency: profile.frequencyCount,
                hydration_period: profile.frequency
            };

            // Save the profile - put if new, post if existing
            let method = 'POST';
            if (profile.new) {
                method = 'PUT';
            }
            console.log(payload);
            const response = await fetch(API_URL + '/stored-profile', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log(response);


            refreshData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (

        <section id="agency_location" className="hl_wrapper--inner hl_agency hl_agency-location--details" style={{backgroundColor: "#f2f7fa"}}>
            { (customer !== '') &&
            <div className="container-fluid">
                <div className="mt-3">

                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <Form onSubmit={handleFormSubmit}>
                            <div className="card">
                                <div className="card-header">
                                    <h2>Ideal Customer Profile (ICP)</h2>
                                    {(var_editing >= 0) &&
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={handleCloseClick}
                                            >Close
                                            </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-sm"
                                            >Save
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className="card-body">
                                    <div className="tab-content">
                                        <div id="prospect" role="tabpanel" aria-labelledby="prospect-tab"
                                             className="tab-pane fade show active" style={{padding: "0px"}}>
                                            <div style={{padding: "15px"}}>


                                                <div className="form-group">
                                                <span className="text-sm font-medium text-gray-700">
                                                    ICP Description
                                                </span>
                                                    <div
                                                        className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1"
                                                        data-lpignore="true" autoComplete="msgsndr1"
                                                        data-vv-as="revenue">
                                                        <input
                                                            disabled={!(var_editing >= 0)}

                                                            value={profile.description}
                                                            onChange={e => handleProfileDescriptionChange(e.target.value)}
                                                            type="text"
                                                            data-lpignore="true"
                                                            autoComplete="msgsndr1"
                                                            placeholder="Short description of your Ideal Customer Profile"
                                                            className="hl-text-input  focus:ring-curious-blue-500 focus:border-curious-blue-500 block w-full sm:text-sm border-gray-300 rounded disabled:opacity-50 text-gray-800"
                                                            name="msgsndr1"
                                                            maxLength=""
                                                        />

                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Profile State
                                                </span>
                                                    <div
                                                        className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1"
                                                        data-lpignore="true" autoComplete="msgsndr1"
                                                        data-vv-as="revenue">
                                                        <ToggleButtonGroup
                                                            disabled={!(var_editing >= 0)}
                                                            color="primary"
                                                            value={profile.state}
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
                                                    <div className="hl-text-input-container msgsndr5"
                                                         data-lpignore="true" data-vv-as="Job title">
                                                        <div className="flex space-x-3">
                                                            <span htmlFor="msgsndr5"
                                                                  className="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">Job Title</span>
                                                        </div>
                                                        <div className="relative rounded-md ">
                                                            <Autocomplete
                                                                disabled={!(var_editing >= 0)}
                                                                multiple
                                                                limitTags={2}
                                                                id="multiple-limit-tags"
                                                                options={jobTitles}
                                                                value={profile.jobTitles}
                                                                onChange={handleProfileJobTitlesChange}
                                                                defaultValue={[]}
                                                                className="w-full"
                                                                renderInput={(params) => (
                                                                    <TextField {...params} className="input-no-shadow"
                                                                               label="" placeholder=""/>
                                                                )}
                                                            />
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="hl-text-input-container msgsndr6"
                                                         data-lpignore="true" data-vv-as="Location">
                                                        <div className="flex space-x-3">
                                                            <span htmlFor="msgsndr6"
                                                                  className="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">Location(s)</span>
                                                        </div>
                                                        <Autocomplete
                                                            disabled={!(var_editing >= 0)}
                                                            multiple
                                                            limitTags={2}
                                                            id="multiple-limit-tags"
                                                            options={locations}
                                                            value={profile.locations}
                                                            onChange={handleProfileLocationsChange}
                                                            defaultValue={[]}
                                                            className="w-full"
                                                            renderInput={(params) => (
                                                                <TextField {...params} className="input-no-shadow"
                                                                           label="" placeholder=""/>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="hl-text-input-container msgsndr6"
                                                         data-lpignore="true" data-vv-as="Location">
                                                        <div className="flex space-x-3">
                                                            <span htmlFor="msgsndr6"
                                                                  className="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">Industry</span>
                                                        </div>
                                                        <Autocomplete
                                                            disabled={!(var_editing >= 0)}
                                                            multiple
                                                            limitTags={2}
                                                            id="multiple-limit-tags"
                                                            options={industries}
                                                            value={profile.industries}
                                                            onChange={handleProfileIndustriesChange}
                                                            defaultValue={[]}
                                                            className="w-full"
                                                            renderInput={(params) => (
                                                                <TextField {...params} className="input-no-shadow"
                                                                           label="" placeholder=""/>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="hl-text-input-container msgsndr6"
                                                         data-lpignore="true" data-vv-as="Location">
                                                        <div className="flex space-x-3">
                                                            <span htmlFor="msgsndr6"
                                                                  className="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">Number of Employees</span>
                                                        </div>
                                                        <Autocomplete
                                                            disabled={!(var_editing >= 0)}
                                                            multiple
                                                            limitTags={2}
                                                            id="multiple-limit-tags"
                                                            options={employees}
                                                            value={profile.employeeCounts}
                                                            onChange={handleProfileEmployeeCountsChange}
                                                            getOptionLabel={(option) => option}
                                                            defaultValue={[]}
                                                            className="w-full"
                                                            renderInput={(params) => (
                                                                <TextField {...params} className="input-no-shadow"
                                                                           label="" placeholder=""/>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Company Revenue
                                                </span>
                                                    <div
                                                        className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1"
                                                        data-lpignore="true" autoComplete="msgsndr1"
                                                        data-vv-as="revenue">
                                                        <div className="flex space-x-3">

                                                        </div>
                                                        <div className="relative rounded-md">
                                                            <div className="input-group">
                                                                <div className="input-group col-md-5">
                                                                    <div className="input-group-prepend">
                                                                        <span className="input-group-text">$</span>
                                                                    </div>
                                                                    <input
                                                                        disabled={!(var_editing >= 0)}
                                                                        type="text"
                                                                        value={profile.revenueMin}
                                                                        onChange={e => handleProfileRevenueMinChange(e.target.value)}
                                                                        style={{
                                                                            fontSize: "0.875rem",
                                                                            lineHeight: "1.25rem"
                                                                        }}
                                                                        className="form-control sm:text-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 border-gray-300 disabled:opacity-50 text-gray-800"
                                                                        aria-label="Amount (to the nearest dollar)"
                                                                    />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text">.00</span>
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className="input-group-addon col-md-2 center"> <FontAwesomeIcon
                                                                    icon={faArrowsH}
                                                                    style={{position: "relative", top: "5px"}}/> </span>
                                                                <div className="input-group col-md-5">
                                                                    <div className="input-group-prepend">
                                                                        <span className="input-group-text">$</span>
                                                                    </div>
                                                                    <input
                                                                        disabled={!(var_editing >= 0)}
                                                                        type="text"
                                                                        value={profile.revenueMax}
                                                                        onChange={e => handleProfileRevenueMaxChange(e.target.value)}
                                                                        style={{
                                                                            fontSize: "0.875rem",
                                                                            lineHeight: "1.25rem"
                                                                        }}
                                                                        className="form-control sm:text-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 border-gray-300 disabled:opacity-50 text-gray-800"
                                                                        aria-label="Amount (to the nearest dollar)"
                                                                    />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text">.00</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Prospect Tag
                                                </span>
                                                    <div
                                                        className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1"
                                                        data-lpignore="true" autoComplete="msgsndr1"
                                                        data-vv-as="revenue">
                                                        <div className="flex space-x-3">

                                                        </div>
                                                        <div className="relative rounded-md ">
                                                            <input
                                                                disabled={!(var_editing >= 0)}
                                                                value={profile.tag}
                                                                onChange={e => handleProfileTagChange(e.target.value)}
                                                                type="text"
                                                                data-lpignore="true"
                                                                autoComplete="msgsndr1"
                                                                placeholder="Tag Added to Prospect"
                                                                className="hl-text-input  focus:ring-curious-blue-500 focus:border-curious-blue-500 block w-full sm:text-sm border-gray-300 rounded disabled:opacity-50 text-gray-800"
                                                                name="msgsndr1"
                                                                maxLength=""
                                                            />

                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Hydration Frequency
                                                </span>
                                                    <div
                                                        className="hl-text-input-container msgsndr1 disabled:opacity-50 msgsndr1"
                                                        data-lpignore="true" autoComplete="msgsndr1"
                                                        data-vv-as="revenue">
                                                        <TextField
                                                            disabled={!(var_editing >= 0)}
                                                            type="number"
                                                            id="outlined-basic"
                                                            size="small"
                                                            onChange={(e) => handleProfileFrequencyCountChange(e.target.value)}
                                                            value={profile.frequencyCount}
                                                        />

                                                        <span style={{
                                                            paddingLeft: '1rem',
                                                            paddingRight: '1rem'
                                                        }}>per</span>

                                                        <ToggleButtonGroup
                                                            disabled={!(var_editing >= 0)}
                                                            color="primary"
                                                            exclusive
                                                            size="small"
                                                            value={profile.frequency}
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

                                            {(var_editing >= 0) &&
                                                <button
                                                    disabled={!(var_editing >= 0)}
                                                    onClick={handleTestClick}
                                                    type="button"
                                                    className={"btn float-right" + (var_editing >= 0 ? " btn-primary" : " btn-dark")}
                                                >Test Now</button>
                                            }
                                        </div>

                                    </div>
                                </div>


                            </div>
                        </Form>
                    </div>
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header d-flex">
                                <h2 className="mr-auto">Stored Profiles</h2>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    style={{marginRight: '1rem'}}
                                    onClick={handleAddClick}
                                >New
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={handleRefreshClick}
                                ><FontAwesomeIcon icon={faRefresh}/></button>
                            </div>
                            <div className="card-body">
                                <div className="tab-content">
                                    <div id="note" role="tabpanel" aria-labelledby="note-tab"
                                         className="tab-pane fade show active">
                                        <div className="form-group">
                                            <div className="">
                                                {profiles.length > 0 &&
                                                    <table className={"table table-striped"}>
                                                        <thead className={"thead-light"}>
                                                        <tr>
                                                            <th scope={"col"}><strong>Description</strong></th>
                                                            <th scope={"col"}><strong>Status</strong></th>
                                                            <th className={"text-right"} scope={"col"}>
                                                                <strong>Actions</strong></th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {profiles.map((item, i) =>
                                                            <tr key={i}
                                                                className={(var_editing === i) ? 'table-primary' : ''}>
                                                                <td>{item.description}</td>
                                                                <td>{item.state.toUpperCase()}</td>
                                                                <td className={"text-right"}>
                                                                    <Button
                                                                        variant="contained"
                                                                        size="small"
                                                                        tabIndex={i}
                                                                        onClick={(e) => handleEditProfileClick(e, i)}
                                                                        className="btn btn-primary btn-sm"
                                                                    ><FontAwesomeIcon icon={faEdit}/>
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        </tbody>
                                                    </table>
                                                }
                                                {profiles.length === 0 &&
                                                    <div>No stored profiles</div>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                        {/*<div className="card">*/}
                        {/*    <div className="card-header">*/}
                        {/*        <h2 >Activity</h2>*/}
                        {/*    </div>*/}
                        {/*    <div className="card-body">*/}
                        {/*        <ul role="tablist" className="nav nav-tabs activity-tab">*/}
                        {/*            <li className="nav-item"><a id="note-tab" data-toggle="tab" href="#note" role="tab" aria-controls="note" aria-selected="false" className="nav-link active">Details</a></li>*/}
                        {/*        </ul>*/}
                        {/*        <div className="tab-content">*/}
                        {/*            <div id="note" role="tabpanel" aria-labelledby="note-tab" className="tab-pane fade show active">*/}
                        {/*                <div className="form-group">*/}
                        {/*                    <div className="">*/}

                        {/*                        <div className="mt-1 relative rounded-md ">*/}
                        {/*                            <textarea placeholder="Enter note" name="note" className="hl-text-area-input  text-gray-800  block w-full focus:outline-none focus:ring-offset-curious-blue-500 focus:border-curious-blue-500 sm:text-sm border-gray-300 rounded-md disabled:opacity-50" rows="4" type="text" maxLength=""></textarea>*/}

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
            }
            { (customer === '') &&
            <div>Customer not found</div>

            }

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Testing Ideal Customer Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(searchResponse !== null) &&
                        <div>
                            <div className="form-group">
                                <div className="d-flex justify-content-center" data-lpignore="true"
                                     autoComplete="msgsndr1" data-vv-as="revenue">
                                    <h2>Total Entries: {searchResponse?.total_entries?.toLocaleString()}</h2>
                                </div>
                            </div>
                        </div>
                    }
                    {(searchResponse === null) &&
                        <div>
                            <div className="form-group">
                                <div className="d-flex justify-content-center" data-lpignore="true"
                                     autoComplete="msgsndr1" data-vv-as="revenue">
                                    <div className="spinner-border" style={{width: "3rem", height: "3rem"}}
                                         role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Make Changes
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Profile
                    </Button>
                </Modal.Footer>
            </Modal>

        </section>
    );
};

export default ClientForm;
