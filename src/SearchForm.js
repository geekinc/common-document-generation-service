// src/SearchForm.js
import React, { useState } from 'react';
import { Accordion, Card, Button, Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import CurrencyInput from 'react-currency-input-field';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';


import './App.css';


const SearchForm = () => {
    const [results, setResults] = useState(null);
    const [totalEntries, setTotalEntries] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [payload, setPayload] = useState({
        api_key: "iAw6Qq-w9nmZsCYvcLGW1g",
        person_titles: ["Safety Manager", "Safety Supervisor"],
        person_locations : ["Canada"],
        organization_num_employees_ranges: ['1,10', '11,20', '21,50', '51,100'],
        contact_email_status: ["verified"],
        revenue_range: {"max": "5000000", "min": "500000"},
        per_page: 200,
        page: 1
    });

    const downloadCSV = () => {
        // Create a flattened array of people
        let flattenedPeople = results.people.map(person => ({
            first_name: person.first_name,
            last_name: person.last_name,
            title: person.title,
            linkedin_url: person.linkedin_url,
            photo_url: person.photo_url,
            twitter_url: person.twitter_url,
            facebook_url: person.facebook_url,
            email: person.email,
            organization: person.organization?.name,
            phoneNumbers: person.phone_numbers && person.phone_numbers.length > 0 ? person.phone_numbers[0].sanitized_number : 'N/A',
            city: person.city,
            state: person.state,
            country: person.country,
        }));

        // Convert JSON to CSV
        const csv = Papa.unparse(flattenedPeople);
        // Create a new Blob with the CSV
        let blob = new Blob([csv], { type: 'text/csv' });

        // Create a link to download the Blob
        let a = document.createElement('a');
        a.download = 'people.csv';
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/csv', a.download, a.href].join(':');

        // Start the download
        a.click();
    }

    const copyPayloadToClipboard = () => {
        const { api_key, ...payloadToCopy } = payload;  // Exclude api_key
        navigator.clipboard.writeText(JSON.stringify(payloadToCopy, null, 2))  // Copy as formatted JSON
            .then(() => {
                // Notify the user
                toast.success('Payload copied to clipboard!', {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
            })
            .catch(err => console.error('Could not copy text: ', err));
    };

    const extractTotalEntries = (data) => {
        if (data && data.pagination && data.pagination.total_entries) {
            return data.pagination.total_entries;
        }
        return 0;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch('https://ty9vcdxik7.execute-api.us-east-1.amazonaws.com/prod/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            setIsLoading(false);
            setResults(data);  // set the results state with the data received
            setTotalEntries(extractTotalEntries(data));
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (["person_titles", "person_locations", "organization_num_employees_ranges", "contact_email_status"].includes(name)) {
            value = value.split(',').map(item => item.trim());
        }
        if (name.includes("revenue_range")) {
            let rangeName = name.split(".")[1];
            setPayload(prevPayload => ({
                ...prevPayload,
                revenue_range: {
                    ...prevPayload.revenue_range,
                    [rangeName]: value
                }
            }));
        } else {
            setPayload(prevPayload => ({
                ...prevPayload,
                [name]: value
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, value } = e.target;
        setPayload(prevState => {
            const newOrganizationNumEmployeesRanges = [...prevState.organization_num_employees_ranges];

            if (e.target.checked) {
                newOrganizationNumEmployeesRanges.push(value);
            } else {
                const index = newOrganizationNumEmployeesRanges.indexOf(value);
                if (index > -1) {
                    newOrganizationNumEmployeesRanges.splice(index, 1);
                }
            }

            return { ...prevState, [name]: newOrganizationNumEmployeesRanges };
        });
    }


    const handleRevenueRangeInputChange = (value, name) => {
        setPayload(prevState => ({
            ...prevState,
            revenue_range: {
                ...prevState.revenue_range,
                [name]: value
            }
        }));
    }

    return (
        <Container fluid className="container-fluid">
            <ToastContainer />
            <Form onSubmit={handleFormSubmit}  className="">
                <Row className="row-height">
                    <Col md={4} className="column-left">
                        <Accordion defaultActiveKey="0">  {/* You can set a default open accordion here */}

                            {/* Job Titles */}
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle className="left-aligned" as={Button} variant="link" eventKey="0">
                                    Job Titles: {payload.person_titles.join(", ")}
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Form.Group controlId="person_titles">
                                        <Form.Label>Enter job titles</Form.Label>
                                        <Form.Control type="text" placeholder="Enter job titles" name="person_titles" defaultValue={payload.person_titles.join(", ")} onChange={handleInputChange} />
                                    </Form.Group>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>

                        {/* Person Locations */}
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle className="left-aligned" as={Button} variant="link" eventKey="1">
                                    Person Locations: {payload.person_locations.join(", ")}
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Form.Group controlId="person_locations">
                                        <Form.Label>Enter person locations</Form.Label>
                                        <Form.Control type="text" placeholder="Enter person locations" name="person_locations" defaultValue={payload.person_locations.join(", ")} onChange={handleInputChange} />
                                    </Form.Group>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>

                            {/* Organization Number of Employees Ranges */}
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle className="left-aligned" as={Button} variant="link" eventKey="2">
                                        Number of Employees Ranges:&nbsp;
                                        {payload.organization_num_employees_ranges.join(", ")}
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2">
                                    <Card.Body>
                                        <Form.Group controlId="organization_num_employees_ranges">
                                            <Form.Label>Select number of employees ranges</Form.Label>
                                            {['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001-2000', '2001-5000', '5001-10000', '10001+'].map((range) => (
                                                <Form.Check
                                                    key={range}
                                                    type="checkbox"
                                                    label={range}
                                                    name="organization_num_employees_ranges"
                                                    value={range.replace('-', ',')}
                                                    defaultChecked={payload.organization_num_employees_ranges.includes(range.replace('-', ','))}
                                                    onChange={handleCheckboxChange} // You'll need to create this handler
                                                />
                                            ))}
                                        </Form.Group>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            {/* Revenue Range */}
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle className="left-aligned" as={Button} variant="link" eventKey="4">
                                        Revenue Range: Min {payload.revenue_range.min}, Max {payload.revenue_range.max}
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="4">
                                    <Card.Body>
                                        <Form.Group controlId="revenue_range">
                                            <Form.Label>Min:</Form.Label>&nbsp;
                                            <CurrencyInput
                                                id="min"
                                                name="min"
                                                placeholder="Enter minimum revenue"
                                                className="form-control"
                                                defaultValue={payload.revenue_range.min}
                                                onValueChange={(value, name) => handleRevenueRangeInputChange(value, name)}
                                                intlConfig={{ locale: 'en-US', currency: 'USD' }}
                                                decimalsLimit={2}
                                                prefix="$"
                                            />
                                            <br />
                                            <Form.Label>Max:</Form.Label>&nbsp;
                                            <CurrencyInput
                                                id="max"
                                                name="max"
                                                placeholder="Enter maximum revenue"
                                                className="form-control"
                                                defaultValue={payload.revenue_range.max}
                                                onValueChange={(value, name) => handleRevenueRangeInputChange(value, name)}
                                                intlConfig={{ locale: 'en-US', currency: 'USD' }}
                                                decimalsLimit={2}
                                                prefix="$"
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                        </Accordion>
                        <Button variant="secondary" className="copy-button" onClick={copyPayloadToClipboard}>
                            Copy Details
                        </Button>

                        <Button variant="primary" type="submit" className="submit-button">
                            Lookup
                        </Button>

                    </Col>
                    <Col md={8} className="column-right">
                        <div className="column-header">
                        {totalEntries > 0 &&
                            <>
                                <h3>Total Number of Prospects: {totalEntries.toLocaleString("en-US")}</h3>
                                {isLoading && <div>Loading...</div>}
                                <Button variant="primary" className="download-csv" onClick={downloadCSV}>
                                    Download Sample
                                </Button>
                            </>
                        }
                        {(totalEntries < 1 && isLoading) && <div>Loading...</div>}
                        </div>
                        <div className="column-scroll">
                            {results && (
                                <div className="results-area">
                                    <Row className="card-container">
                                        {results.people && results.people.map((person, index) => (
                                            <Col md={4} key={index}>
                                                <Card className="card-result">
                                                    <Card.Body>
                                                        <Card.Title>{person.name}</Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">{person.organization?.name}</Card.Subtitle>
                                                        <Card.Text>
                                                            Phone number: {person.phone_numbers && person.phone_numbers[0] ? person.phone_numbers[0].sanitized_number : 'N/A'} <br />
                                                            {person.city && <span>Location: {person.city && person.country ? person.city + ', ' + person.country : 'N/A'}</span> }
                                                        </Card.Text>
                                                        <div className="card-link-footer">
                                                            {person.linkedin_url &&
                                                                <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer">
                                                                    <FaLinkedin size={20} />
                                                                </a>
                                                            }
                                                            {person.email &&
                                                                <a href={`mailto:${person.email}`} target="_blank" rel="noopener noreferrer">
                                                                    <MdEmail size={20} />
                                                                </a>
                                                            }
                                                            { person.organization?.logo_url && <a target="_blank" href={person.organization?.website_url}><img className="card-logo" src={person.organization?.logo_url} /></a> }
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Form>

        </Container>
    );
};

export default SearchForm;
