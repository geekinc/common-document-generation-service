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
    const [profileState, setProfileState] = React.useState('testing');

    const _ = require('underscore');

    let jobTitles = [
        {
            "id":"55d289d8e9d3a43085fae858",
            "name":"account manager"
        },
        {
            "id":"55d289d8e9d3a43085fae85e",
            "name":"associate"
        },
        {
            "id":"55d289d8e9d3a43085fae860",
            "name":"administrative assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae866",
            "name":"accountant"
        },
        {
            "id":"55d289d8e9d3a43085fae868",
            "name":"account executive"
        },
        {
            "id":"55d289d8e9d3a43085fae869",
            "name":"assistant manager"
        },
        {
            "id":"55d289d8e9d3a43085fae876",
            "name":"analyst"
        },
        {
            "id":"55d289d8e9d3a43085fae877",
            "name":"assistant professor"
        },
        {
            "id":"55d289d8e9d3a43085fae87f",
            "name":"associate professor"
        },
        {
            "id":"55d289d8e9d3a43085fae88a",
            "name":"administrator"
        },
        {
            "id":"55d289d8e9d3a43085fae88d",
            "name":"attorney"
        },
        {
            "id":"55d289d8e9d3a43085fae8a5",
            "name":"agent"
        },
        {
            "id":"55d289d8e9d3a43085fae8b1",
            "name":"area manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8b3",
            "name":"administrativo"
        },
        {
            "id":"55d289d8e9d3a43085fae8b7",
            "name":"architect"
        },
        {
            "id":"55d289d8e9d3a43085fae8bf",
            "name":"admin"
        },
        {
            "id":"55d289d8e9d3a43085fae8c0",
            "name":"auditor"
        },
        {
            "id":"55d289d8e9d3a43085fae8c9",
            "name":"assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae8ce",
            "name":"analista"
        },
        {
            "id":"55d289d8e9d3a43085fae8d1",
            "name":"associate director"
        },
        {
            "id":"55d289d8e9d3a43085fae870",
            "name":"business analyst"
        },
        {
            "id":"55d289d8e9d3a43085fae872",
            "name":"business development manager"
        },
        {
            "id":"55d289d8e9d3a43085fae87a",
            "name":"branch manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8a9",
            "name":"business manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8af",
            "name":"buyer"
        },
        {
            "id":"55d289d8e9d3a43085fae8c5",
            "name":"business development"
        },
        {
            "id":"55d289d8e9d3a43085fae90e",
            "name":"broker"
        },
        {
            "id":"55d289d8e9d3a43085fae911",
            "name":"banker"
        },
        {
            "id":"55d289d8e9d3a43085fae949",
            "name":"business development executive"
        },
        {
            "id":"55d289d8e9d3a43085fae94b",
            "name":"business consultant"
        },
        {
            "id":"55d289d8e9d3a43085fae973",
            "name":"brand manager"
        },
        {
            "id":"55d289d8e9d3a43085fae97c",
            "name":"bookkeeper"
        },
        {
            "id":"55d289d8e9d3a43085fae990",
            "name":"barista"
        },
        {
            "id":"55d289d8e9d3a43085fae9a2",
            "name":"broker associate"
        },
        {
            "id":"55d289d8e9d3a43085fae9b4",
            "name":"bartender"
        },
        {
            "id":"55d289d8e9d3a43085faea23",
            "name":"board member"
        },
        {
            "id":"55d289d9e9d3a43085faea5b",
            "name":"business development director"
        },
        {
            "id":"55d289d9e9d3a43085faea99",
            "name":"business"
        },
        {
            "id":"55d289d9e9d3a43085faeabd",
            "name":"business owner"
        },
        {
            "id":"55d289d9e9d3a43085faeabf",
            "name":"boss"
        },
        {
            "id":"55d289d8e9d3a43085fae857",
            "name":"consultant"
        },
        {
            "id":"55d289d8e9d3a43085fae865",
            "name":"ceo"
        },
        {
            "id":"55d289d8e9d3a43085fae885",
            "name":"customer service"
        },
        {
            "id":"55d289d8e9d3a43085fae88c",
            "name":"controller"
        },
        {
            "id":"55d289d8e9d3a43085fae88e",
            "name":"customer service representative"
        },
        {
            "id":"55d289d8e9d3a43085fae892",
            "name":"cashier"
        },
        {
            "id":"55d289d8e9d3a43085fae8b9",
            "name":"cfo"
        },
        {
            "id":"55d289d8e9d3a43085fae8c6",
            "name":"csr"
        },
        {
            "id":"55d289d8e9d3a43085fae8ca",
            "name":"clerk"
        },
        {
            "id":"55d289d8e9d3a43085fae8e9",
            "name":"civil engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae8f5",
            "name":"coordinator"
        },
        {
            "id":"55d289d8e9d3a43085fae8fb",
            "name":"creative director"
        },
        {
            "id":"55d289d8e9d3a43085fae901",
            "name":"customer service manager"
        },
        {
            "id":"55d289d8e9d3a43085fae906",
            "name":"chef"
        },
        {
            "id":"55d289d8e9d3a43085fae912",
            "name":"co-founder"
        },
        {
            "id":"55d289d8e9d3a43085fae91b",
            "name":"chief operating officer"
        },
        {
            "id":"55d289d8e9d3a43085fae927",
            "name":"consultor"
        },
        {
            "id":"55d289d8e9d3a43085fae929",
            "name":"chief financial officer"
        },
        {
            "id":"55d289d8e9d3a43085fae933",
            "name":"case manager"
        },
        {
            "id":"55d289d8e9d3a43085fae951",
            "name":"captain"
        },
        {
            "id":"55d289d8e9d3a43085fae855",
            "name":"director"
        },
        {
            "id":"55d289d8e9d3a43085fae879",
            "name":"docente"
        },
        {
            "id":"55d289d8e9d3a43085fae899",
            "name":"designer"
        },
        {
            "id":"55d289d8e9d3a43085fae8aa",
            "name":"developer"
        },
        {
            "id":"55d289d8e9d3a43085fae8b5",
            "name":"design engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae8b6",
            "name":"driver"
        },
        {
            "id":"55d289d8e9d3a43085fae8c1",
            "name":"district manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8dc",
            "name":"director of operations"
        },
        {
            "id":"55d289d8e9d3a43085fae8de",
            "name":"doctor"
        },
        {
            "id":"55d289d8e9d3a43085fae90d",
            "name":"deputy manager"
        },
        {
            "id":"55d289d8e9d3a43085fae92b",
            "name":"directeur"
        },
        {
            "id":"55d289d8e9d3a43085fae93b",
            "name":"director of sales"
        },
        {
            "id":"55d289d8e9d3a43085fae943",
            "name":"data analyst"
        },
        {
            "id":"55d289d8e9d3a43085fae947",
            "name":"dr"
        },
        {
            "id":"55d289d8e9d3a43085fae982",
            "name":"district sales manager"
        },
        {
            "id":"55d289d8e9d3a43085fae9a7",
            "name":"director of marketing"
        },
        {
            "id":"55d289d8e9d3a43085fae9b3",
            "name":"diretor"
        },
        {
            "id":"55d289d8e9d3a43085fae9b9",
            "name":"director of business development"
        },
        {
            "id":"55d289d8e9d3a43085fae9df",
            "name":"development manager"
        },
        {
            "id":"55d289d8e9d3a43085fae9eb",
            "name":"department manager"
        },
        {
            "id":"55d289d8e9d3a43085fae859",
            "name":"engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae871",
            "name":"executive assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae88b",
            "name":"executive director"
        },
        {
            "id":"55d289d8e9d3a43085fae8a7",
            "name":"executive"
        },
        {
            "id":"55d289d8e9d3a43085fae8bb",
            "name":"electrical engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae8d3",
            "name":"educator"
        },
        {
            "id":"55d289d8e9d3a43085fae8e0",
            "name":"empleado"
        },
        {
            "id":"55d289d8e9d3a43085fae8ef",
            "name":"editor"
        },
        {
            "id":"55d289d8e9d3a43085fae8fc",
            "name":"engineering manager"
        },
        {
            "id":"55d289d8e9d3a43085fae905",
            "name":"electrician"
        },
        {
            "id":"55d289d8e9d3a43085fae92e",
            "name":"estudiante"
        },
        {
            "id":"55d289d8e9d3a43085fae930",
            "name":"employee"
        },
        {
            "id":"55d289d8e9d3a43085fae94f",
            "name":"estudante"
        },
        {
            "id":"55d289d8e9d3a43085fae95f",
            "name":"english teacher"
        },
        {
            "id":"55d289d8e9d3a43085fae99f",
            "name":"enseignante"
        },
        {
            "id":"55d289d8e9d3a43085fae9aa",
            "name":"enseignant"
        },
        {
            "id":"55d289d8e9d3a43085fae9af",
            "name":"empleada"
        },
        {
            "id":"55d289d8e9d3a43085fae9b1",
            "name":"executive vice president"
        },
        {
            "id":"55d289d8e9d3a43085fae9bc",
            "name":"economist"
        },
        {
            "id":"55d289d8e9d3a43085fae9dc",
            "name":"executive secretary"
        },
        {
            "id":"55d289d8e9d3a43085fae898",
            "name":"financial analyst"
        },
        {
            "id":"55d289d8e9d3a43085fae89d",
            "name":"financial advisor"
        },
        {
            "id":"55d289d8e9d3a43085fae8ab",
            "name":"finance manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8d4",
            "name":"founder"
        },
        {
            "id":"55d289d8e9d3a43085fae8f8",
            "name":"financial controller"
        },
        {
            "id":"55d289d8e9d3a43085fae917",
            "name":"flight attendant"
        },
        {
            "id":"55d289d8e9d3a43085fae935",
            "name":"finance"
        },
        {
            "id":"55d289d8e9d3a43085fae964",
            "name":"founder and ceo"
        },
        {
            "id":"55d289d8e9d3a43085fae993",
            "name":"field engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae9a1",
            "name":"finance director"
        },
        {
            "id":"55d289d8e9d3a43085fae9b6",
            "name":"field service engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae9e4",
            "name":"faculty"
        },
        {
            "id":"55d289d8e9d3a43085fae9fd",
            "name":"financial consultant"
        },
        {
            "id":"55d289d8e9d3a43085faea06",
            "name":"facilities manager"
        },
        {
            "id":"55d289d8e9d3a43085faea3a",
            "name":"funzionario"
        },
        {
            "id":"55d289d8e9d3a43085faea42",
            "name":"financial manager"
        },
        {
            "id":"55d289d9e9d3a43085faea48",
            "name":"financial representative"
        },
        {
            "id":"55d289d9e9d3a43085faea59",
            "name":"foreman"
        },
        {
            "id":"55d289d9e9d3a43085faea98",
            "name":"financial planner"
        },
        {
            "id":"55d289d9e9d3a43085faeaa1",
            "name":"facility manager"
        },
        {
            "id":"55d289d8e9d3a43085fae862",
            "name":"general manager"
        },
        {
            "id":"55d289d8e9d3a43085fae888",
            "name":"gerente"
        },
        {
            "id":"55d289d8e9d3a43085fae889",
            "name":"graphic designer"
        },
        {
            "id":"55d289d8e9d3a43085fae8eb",
            "name":"graduate student"
        },
        {
            "id":"55d289d8e9d3a43085fae942",
            "name":"graduate research assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae94e",
            "name":"gerente comercial"
        },
        {
            "id":"55d289d8e9d3a43085fae9d7",
            "name":"graduate assistant"
        },
        {
            "id":"55d289d8e9d3a43085faea2a",
            "name":"graduate teaching assistant"
        },
        {
            "id":"55d289d9e9d3a43085faea5d",
            "name":"geologist"
        },
        {
            "id":"55d289d9e9d3a43085faea88",
            "name":"gerente general"
        },
        {
            "id":"55d289d9e9d3a43085faeb46",
            "name":"group leader"
        },
        {
            "id":"55d289d9e9d3a43085faeb5a",
            "name":"general counsel"
        },
        {
            "id":"55d289d9e9d3a43085faeba7",
            "name":"geschäftsführer"
        },
        {
            "id":"55d289d9e9d3a43085faebcd",
            "name":"gepensioneerd"
        },
        {
            "id":"55d289d9e9d3a43085faebd6",
            "name":"geometra"
        },
        {
            "id":"55d289d9e9d3a43085faebf6",
            "name":"gerente de projetos"
        },
        {
            "id":"55d289dae9d3a43085faec5a",
            "name":"group manager"
        },
        {
            "id":"55d289dae9d3a43085faec94",
            "name":"graphic artist"
        },
        {
            "id":"55d289dae9d3a43085faecac",
            "name":"gerente de vendas"
        },
        {
            "id":"55d289d8e9d3a43085fae89f",
            "name":"hr manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8d9",
            "name":"human resources manager"
        },
        {
            "id":"55d289d8e9d3a43085fae92c",
            "name":"human resources"
        },
        {
            "id":"55d289d8e9d3a43085fae958",
            "name":"hr business partner"
        },
        {
            "id":"55d289d8e9d3a43085fae97a",
            "name":"hr executive"
        },
        {
            "id":"55d289d8e9d3a43085fae9a6",
            "name":"hr specialist"
        },
        {
            "id":"55d289d8e9d3a43085fae9c1",
            "name":"hr generalist"
        },
        {
            "id":"55d289d8e9d3a43085fae9e7",
            "name":"hr assistant"
        },
        {
            "id":"55d289d8e9d3a43085faea33",
            "name":"hr officer"
        },
        {
            "id":"55d289d9e9d3a43085faea43",
            "name":"hr consultant"
        },
        {
            "id":"55d289d9e9d3a43085faea50",
            "name":"hr coordinator"
        },
        {
            "id":"55d289d9e9d3a43085faea55",
            "name":"hr director"
        },
        {
            "id":"55d289d9e9d3a43085faea8b",
            "name":"human resources generalist"
        },
        {
            "id":"55d289d9e9d3a43085faeae5",
            "name":"hr advisor"
        },
        {
            "id":"55d289d9e9d3a43085faeb01",
            "name":"hr administrator"
        },
        {
            "id":"55d289d9e9d3a43085faeb0a",
            "name":"human resources specialist"
        },
        {
            "id":"55d289d9e9d3a43085faeb15",
            "name":"housewife"
        },
        {
            "id":"55d289d9e9d3a43085faeb16",
            "name":"homemaker"
        },
        {
            "id":"55d289d9e9d3a43085faeb21",
            "name":"human resource manager"
        },
        {
            "id":"55d289d8e9d3a43085fae87d",
            "name":"intern"
        },
        {
            "id":"55d289d8e9d3a43085fae896",
            "name":"instructor"
        },
        {
            "id":"55d289d8e9d3a43085fae8a8",
            "name":"it manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8ae",
            "name":"impiegato"
        },
        {
            "id":"55d289d8e9d3a43085fae8f6",
            "name":"impiegata"
        },
        {
            "id":"55d289d8e9d3a43085fae902",
            "name":"it specialist"
        },
        {
            "id":"55d289d8e9d3a43085fae90f",
            "name":"it consultant"
        },
        {
            "id":"55d289d8e9d3a43085fae92f",
            "name":"insurance agent"
        },
        {
            "id":"55d289d8e9d3a43085fae93a",
            "name":"independent consultant"
        },
        {
            "id":"55d289d8e9d3a43085fae94d",
            "name":"it analyst"
        },
        {
            "id":"55d289d8e9d3a43085fae96e",
            "name":"inside sales"
        },
        {
            "id":"55d289d8e9d3a43085fae986",
            "name":"internal auditor"
        },
        {
            "id":"55d289d8e9d3a43085fae98a",
            "name":"it project manager"
        },
        {
            "id":"55d289d8e9d3a43085fae996",
            "name":"inspector"
        },
        {
            "id":"55d289d8e9d3a43085fae9b7",
            "name":"internship"
        },
        {
            "id":"55d289d8e9d3a43085fae9c4",
            "name":"independent distributor"
        },
        {
            "id":"55d289d8e9d3a43085fae9cc",
            "name":"interior designer"
        },
        {
            "id":"55d289d8e9d3a43085faea0a",
            "name":"insegnante"
        },
        {
            "id":"55d289d9e9d3a43085faea56",
            "name":"inside sales representative"
        },
        {
            "id":"55d289d8e9d3a43085fae919",
            "name":"journalist"
        },
        {
            "id":"55d289d8e9d3a43085fae9a3",
            "name":"java developer"
        },
        {
            "id":"55d289d9e9d3a43085faea6c",
            "name":"jubilado"
        },
        {
            "id":"55d289d9e9d3a43085faebd8",
            "name":"junior consultant"
        },
        {
            "id":"55d289d9e9d3a43085faec14",
            "name":"journaliste"
        },
        {
            "id":"55d289d9e9d3a43085faec24",
            "name":"junior engineer"
        },
        {
            "id":"55d289dae9d3a43085faec4d",
            "name":"jubilada"
        },
        {
            "id":"55d289dae9d3a43085faeddc",
            "name":"juriste"
        },
        {
            "id":"55d289dae9d3a43085faede5",
            "name":"jefe de proyectos"
        },
        {
            "id":"55d289dce9d3a43085faee32",
            "name":"jefe de proyecto"
        },
        {
            "id":"55d289dce9d3a43085faee40",
            "name":"jefe de departamento"
        },
        {
            "id":"55d289dce9d3a43085faee93",
            "name":"jornalista"
        },
        {
            "id":"55d289dce9d3a43085faeea0",
            "name":"junior accountant"
        },
        {
            "id":"55d289dce9d3a43085faeeaf",
            "name":"jefe de ventas"
        },
        {
            "id":"55d289dce9d3a43085faeeb2",
            "name":"jurist"
        },
        {
            "id":"55d289dce9d3a43085faeedd",
            "name":"junior software engineer"
        },
        {
            "id":"55d289dce9d3a43085faef6e",
            "name":"junior designer"
        },
        {
            "id":"55d289dce9d3a43085faeff0",
            "name":"junior software developer"
        },
        {
            "id":"55d289dce9d3a43085faf012",
            "name":"junior associate"
        },
        {
            "id":"55d289d8e9d3a43085fae891",
            "name":"key account manager"
        },
        {
            "id":"55d289d9e9d3a43085faeb80",
            "name":"kindergarten teacher"
        },
        {
            "id":"55d289d9e9d3a43085faebe6",
            "name":"konsulent"
        },
        {
            "id":"55d289dce9d3a43085faeef3",
            "name":"key account executive"
        },
        {
            "id":"55d289dce9d3a43085faeffa",
            "name":"key accounts manager"
        },
        {
            "id":"55d289dce9d3a43085faf0d1",
            "name":"konsult"
        },
        {
            "id":"55d289dce9d3a43085faf107",
            "name":"kitchen manager"
        },
        {
            "id":"55d289dce9d3a43085faf103",
            "name":"key account"
        },
        {
            "id":"55d289dde9d3a43085faf2d1",
            "name":"key holder"
        },
        {
            "id":"55d289dde9d3a43085faf3ce",
            "name":"karyawan"
        },
        {
            "id":"55d289dee9d3a43085faf4f5",
            "name":"kunderådgiver"
        },
        {
            "id":"55d289dee9d3a43085faf59e",
            "name":"kitchen designer"
        },
        {
            "id":"55d289dee9d3a43085faf67e",
            "name":"koordinator"
        },
        {
            "id":"55d289dfe9d3a43085faf920",
            "name":"kontorassistent"
        },
        {
            "id":"55d289dfe9d3a43085faf971",
            "name":"kierownik"
        },
        {
            "id":"55d289dfe9d3a43085faf9b0",
            "name":"kundekonsulent"
        },
        {
            "id":"55d289dfe9d3a43085fafa5b",
            "name":"keyholder"
        },
        {
            "id":"55d289dfe9d3a43085fafb5d",
            "name":"key account specialist"
        },
        {
            "id":"55d289e0e9d3a43085fafccb",
            "name":"knowledge manager"
        },
        {
            "id":"55d289d8e9d3a43085fae875",
            "name":"lecturer"
        },
        {
            "id":"55d289d8e9d3a43085fae8e3",
            "name":"legal assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae8e5",
            "name":"lawyer"
        },
        {
            "id":"55d289d8e9d3a43085fae954",
            "name":"legal secretary"
        },
        {
            "id":"55d289d8e9d3a43085fae95c",
            "name":"librarian"
        },
        {
            "id":"55d289d8e9d3a43085fae9bd",
            "name":"logistics manager"
        },
        {
            "id":"55d289d8e9d3a43085fae9be",
            "name":"loan officer"
        },
        {
            "id":"55d289d8e9d3a43085fae9d1",
            "name":"lead engineer"
        },
        {
            "id":"55d289d8e9d3a43085faea13",
            "name":"legal counsel"
        },
        {
            "id":"55d289d8e9d3a43085faea34",
            "name":"logistics"
        },
        {
            "id":"55d289d9e9d3a43085faea63",
            "name":"logistics coordinator"
        },
        {
            "id":"55d289d9e9d3a43085faeb17",
            "name":"laboratory technician"
        },
        {
            "id":"55d289d9e9d3a43085faeb45",
            "name":"letter carrier"
        },
        {
            "id":"55d289d9e9d3a43085faeb53",
            "name":"law clerk"
        },
        {
            "id":"55d289d9e9d3a43085faeb5b",
            "name":"lab technician"
        },
        {
            "id":"55d289d9e9d3a43085faeb9d",
            "name":"lead consultant"
        },
        {
            "id":"55d289d9e9d3a43085faebfd",
            "name":"libero professionista"
        },
        {
            "id":"55d289d9e9d3a43085faec15",
            "name":"lead software engineer"
        },
        {
            "id":"55d289d9e9d3a43085faec2d",
            "name":"library assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae84f",
            "name":"manager"
        },
        {
            "id":"55d289d8e9d3a43085fae864",
            "name":"managing director"
        },
        {
            "id":"55d289d8e9d3a43085fae87e",
            "name":"marketing manager"
        },
        {
            "id":"55d289d8e9d3a43085fae89b",
            "name":"marketing"
        },
        {
            "id":"55d289d8e9d3a43085fae8ad",
            "name":"mechanical engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae8cf",
            "name":"managing partner"
        },
        {
            "id":"55d289d8e9d3a43085fae8e8",
            "name":"marketing coordinator"
        },
        {
            "id":"55d289d8e9d3a43085fae90a",
            "name":"marketing director"
        },
        {
            "id":"55d289d8e9d3a43085fae91e",
            "name":"marketing executive"
        },
        {
            "id":"55d289d8e9d3a43085fae924",
            "name":"medico"
        },
        {
            "id":"55d289d8e9d3a43085fae936",
            "name":"marketing assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae946",
            "name":"management trainee"
        },
        {
            "id":"55d289d8e9d3a43085fae95a",
            "name":"merchandiser"
        },
        {
            "id":"55d289d8e9d3a43085fae97f",
            "name":"manufacturing engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae980",
            "name":"marketing specialist"
        },
        {
            "id":"55d289d8e9d3a43085fae994",
            "name":"mechanic"
        },
        {
            "id":"55d289d8e9d3a43085fae999",
            "name":"medical assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae9fa",
            "name":"maintenance manager"
        },
        {
            "id":"55d289d8e9d3a43085fae897",
            "name":"nurse"
        },
        {
            "id":"55d289d8e9d3a43085fae8b4",
            "name":"network engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae962",
            "name":"network administrator"
        },
        {
            "id":"55d289d8e9d3a43085fae99b",
            "name":"national account manager"
        },
        {
            "id":"55d289d8e9d3a43085fae9d9",
            "name":"national sales manager"
        },
        {
            "id":"55d289d8e9d3a43085fae9e5",
            "name":"nurse practitioner"
        },
        {
            "id":"55d289d9e9d3a43085faeb1c",
            "name":"ninguno"
        },
        {
            "id":"55d289d9e9d3a43085faeb57",
            "name":"nurse manager"
        },
        {
            "id":"55d289dae9d3a43085faec8d",
            "name":"nursing"
        },
        {
            "id":"55d289dae9d3a43085faecae",
            "name":"nutricionista"
        },
        {
            "id":"55d289dae9d3a43085faecf3",
            "name":"nanny"
        },
        {
            "id":"55d289dae9d3a43085faed18",
            "name":"network analyst"
        },
        {
            "id":"55d289dae9d3a43085faedc1",
            "name":"network technician"
        },
        {
            "id":"55d289dae9d3a43085faede6",
            "name":"network manager"
        },
        {
            "id":"55d289dce9d3a43085faee44",
            "name":"network specialist"
        },
        {
            "id":"55d289d8e9d3a43085fae852",
            "name":"owner"
        },
        {
            "id":"55d289d8e9d3a43085fae86b",
            "name":"operations manager"
        },
        {
            "id":"55d289d8e9d3a43085fae86c",
            "name":"office manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8c4",
            "name":"officer"
        },
        {
            "id":"55d289d8e9d3a43085fae8f7",
            "name":"operator"
        },
        {
            "id":"55d289d8e9d3a43085fae93c",
            "name":"office administrator"
        },
        {
            "id":"55d289d8e9d3a43085fae93f",
            "name":"office assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae971",
            "name":"operations"
        },
        {
            "id":"55d289d8e9d3a43085fae98d",
            "name":"occupational therapist"
        },
        {
            "id":"55d289d8e9d3a43085fae99a",
            "name":"operations supervisor"
        },
        {
            "id":"55d289d8e9d3a43085fae9f4",
            "name":"operations director"
        },
        {
            "id":"55d289d8e9d3a43085faea37",
            "name":"operation manager"
        },
        {
            "id":"55d289d9e9d3a43085faea52",
            "name":"operaio"
        },
        {
            "id":"55d289d9e9d3a43085faeab9",
            "name":"operador"
        },
        {
            "id":"55d289d9e9d3a43085faead6",
            "name":"operations analyst"
        },
        {
            "id":"55d289d9e9d3a43085faeaeb",
            "name":"operations coordinator"
        },
        {
            "id":"55d289d9e9d3a43085faeafd",
            "name":"office coordinator"
        },
        {
            "id":"55d289d9e9d3a43085faeb18",
            "name":"owner operator"
        },
        {
            "id":"55d289d9e9d3a43085faeb26",
            "name":"operations specialist"
        },
        {
            "id":"55d289d9e9d3a43085faeb62",
            "name":"outside sales"
        },
        {
            "id":"55d289d8e9d3a43085fae850",
            "name":"project manager"
        },
        {
            "id":"55d289d8e9d3a43085fae85a",
            "name":"professor"
        },
        {
            "id":"55d289d8e9d3a43085fae85d",
            "name":"partner"
        },
        {
            "id":"55d289d8e9d3a43085fae85f",
            "name":"president"
        },
        {
            "id":"55d289d8e9d3a43085fae878",
            "name":"project engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae880",
            "name":"product manager"
        },
        {
            "id":"55d289d8e9d3a43085fae882",
            "name":"principal"
        },
        {
            "id":"55d289d8e9d3a43085fae886",
            "name":"program manager"
        },
        {
            "id":"55d289d8e9d3a43085fae890",
            "name":"professora"
        },
        {
            "id":"55d289d8e9d3a43085fae895",
            "name":"phd student"
        },
        {
            "id":"55d289d8e9d3a43085fae8a1",
            "name":"project coordinator"
        },
        {
            "id":"55d289d8e9d3a43085fae8b0",
            "name":"production manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8b2",
            "name":"pharmacist"
        },
        {
            "id":"55d289d8e9d3a43085fae8c3",
            "name":"paralegal"
        },
        {
            "id":"55d289d8e9d3a43085fae8d5",
            "name":"process engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae8d6",
            "name":"profesor"
        },
        {
            "id":"55d289d8e9d3a43085fae8d8",
            "name":"programmer"
        },
        {
            "id":"55d289d8e9d3a43085fae8ea",
            "name":"physician"
        },
        {
            "id":"55d289d8e9d3a43085fae8f2",
            "name":"pilot"
        },
        {
            "id":"55d289d8e9d3a43085fae8ff",
            "name":"programmer analyst"
        },
        {
            "id":"55d289d8e9d3a43085fae92a",
            "name":"quality manager"
        },
        {
            "id":"55d289d8e9d3a43085fae92d",
            "name":"quality engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae96c",
            "name":"qa engineer"
        },
        {
            "id":"55d289d8e9d3a43085faea26",
            "name":"quality assurance"
        },
        {
            "id":"55d289d8e9d3a43085faea35",
            "name":"quantity surveyor"
        },
        {
            "id":"55d289d9e9d3a43085faea51",
            "name":"quality analyst"
        },
        {
            "id":"55d289d9e9d3a43085faea65",
            "name":"quality assurance manager"
        },
        {
            "id":"55d289d9e9d3a43085faea9d",
            "name":"quadro"
        },
        {
            "id":"55d289d9e9d3a43085faeaa5",
            "name":"qa manager"
        },
        {
            "id":"55d289d9e9d3a43085faeadf",
            "name":"qa analyst"
        },
        {
            "id":"55d289d9e9d3a43085faeb66",
            "name":"quality control"
        },
        {
            "id":"55d289d9e9d3a43085faeb82",
            "name":"quality assurance analyst"
        },
        {
            "id":"55d289d9e9d3a43085faebe5",
            "name":"quality assurance engineer"
        },
        {
            "id":"55d289dae9d3a43085faec55",
            "name":"quality assurance specialist"
        },
        {
            "id":"55d289dae9d3a43085faed2a",
            "name":"quadro direttivo"
        },
        {
            "id":"55d289dae9d3a43085faeddd",
            "name":"qa lead"
        },
        {
            "id":"55d289dce9d3a43085faee58",
            "name":"quality inspector"
        },
        {
            "id":"55d289dce9d3a43085faee8f",
            "name":"quality"
        },
        {
            "id":"55d289d8e9d3a43085fae863",
            "name":"realtor"
        },
        {
            "id":"55d289d8e9d3a43085fae86d",
            "name":"registered nurse"
        },
        {
            "id":"55d289d8e9d3a43085fae887",
            "name":"research assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae89a",
            "name":"receptionist"
        },
        {
            "id":"55d289d8e9d3a43085fae89c",
            "name":"researcher"
        },
        {
            "id":"55d289d8e9d3a43085fae8a3",
            "name":"regional sales manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8b8",
            "name":"recruiter"
        },
        {
            "id":"55d289d8e9d3a43085fae8bc",
            "name":"research associate"
        },
        {
            "id":"55d289d8e9d3a43085fae8c8",
            "name":"real estate agent"
        },
        {
            "id":"55d289d8e9d3a43085fae8cc",
            "name":"regional manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8d2",
            "name":"relationship manager"
        },
        {
            "id":"55d289d8e9d3a43085fae903",
            "name":"recruitment consultant"
        },
        {
            "id":"55d289d8e9d3a43085fae931",
            "name":"research scientist"
        },
        {
            "id":"55d289d8e9d3a43085fae941",
            "name":"retraité"
        },
        {
            "id":"55d289d8e9d3a43085fae966",
            "name":"research analyst"
        },
        {
            "id":"55d289d8e9d3a43085fae985",
            "name":"research fellow"
        },
        {
            "id":"55d289d8e9d3a43085fae9ae",
            "name":"real estate broker"
        },
        {
            "id":"55d289d8e9d3a43085fae9ce",
            "name":"reporter"
        },
        {
            "id":"55d289d8e9d3a43085fae9e3",
            "name":"regional director"
        },
        {
            "id":"55d289d8e9d3a43085fae853",
            "name":"student"
        },
        {
            "id":"55d289d8e9d3a43085fae856",
            "name":"software engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae85b",
            "name":"sales manager"
        },
        {
            "id":"55d289d8e9d3a43085fae85c",
            "name":"sales"
        },
        {
            "id":"55d289d8e9d3a43085fae861",
            "name":"supervisor"
        },
        {
            "id":"55d289d8e9d3a43085fae86e",
            "name":"software developer"
        },
        {
            "id":"55d289d8e9d3a43085fae86f",
            "name":"senior consultant"
        },
        {
            "id":"55d289d8e9d3a43085fae873",
            "name":"sales associate"
        },
        {
            "id":"55d289d8e9d3a43085fae874",
            "name":"senior software engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae87b",
            "name":"sales representative"
        },
        {
            "id":"55d289d8e9d3a43085fae87c",
            "name":"store manager"
        },
        {
            "id":"55d289d8e9d3a43085fae883",
            "name":"senior manager"
        },
        {
            "id":"55d289d8e9d3a43085fae884",
            "name":"secretary"
        },
        {
            "id":"55d289d8e9d3a43085fae88f",
            "name":"senior project manager"
        },
        {
            "id":"55d289d8e9d3a43085fae893",
            "name":"sales executive"
        },
        {
            "id":"55d289d8e9d3a43085fae894",
            "name":"senior associate"
        },
        {
            "id":"55d289d8e9d3a43085fae8a0",
            "name":"senior engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae8a2",
            "name":"system engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae8a4",
            "name":"systems engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae8a6",
            "name":"sales consultant"
        },
        {
            "id":"55d289d8e9d3a43085fae851",
            "name":"teacher"
        },
        {
            "id":"55d289d8e9d3a43085fae881",
            "name":"team leader"
        },
        {
            "id":"55d289d8e9d3a43085fae89e",
            "name":"technician"
        },
        {
            "id":"55d289d8e9d3a43085fae8ba",
            "name":"territory manager"
        },
        {
            "id":"55d289d8e9d3a43085fae8be",
            "name":"team lead"
        },
        {
            "id":"55d289d8e9d3a43085fae8e2",
            "name":"teaching assistant"
        },
        {
            "id":"55d289d8e9d3a43085fae8f3",
            "name":"trainee"
        },
        {
            "id":"55d289d8e9d3a43085fae8fd",
            "name":"tecnico"
        },
        {
            "id":"55d289d8e9d3a43085fae90b",
            "name":"technical manager"
        },
        {
            "id":"55d289d8e9d3a43085fae923",
            "name":"technical lead"
        },
        {
            "id":"55d289d8e9d3a43085fae925",
            "name":"test engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae938",
            "name":"trainer"
        },
        {
            "id":"55d289d8e9d3a43085fae937",
            "name":"technical consultant"
        },
        {
            "id":"55d289d8e9d3a43085fae95d",
            "name":"teller"
        },
        {
            "id":"55d289d8e9d3a43085fae97b",
            "name":"team manager"
        },
        {
            "id":"55d289d8e9d3a43085fae983",
            "name":"technical support"
        },
        {
            "id":"55d289d8e9d3a43085fae98b",
            "name":"tutor"
        },
        {
            "id":"55d289d8e9d3a43085fae99e",
            "name":"technical director"
        },
        {
            "id":"55d289d8e9d3a43085fae9b2",
            "name":"tech"
        },
        {
            "id":"55d289d8e9d3a43085fae9c5",
            "name":"technical support engineer"
        },
        {
            "id":"55d289d8e9d3a43085fae9a8",
            "name":"underwriter"
        },
        {
            "id":"55d289d8e9d3a43085faea3d",
            "name":"unemployed"
        },
        {
            "id":"55d289d9e9d3a43085faeaec",
            "name":"unit manager"
        },
        {
            "id":"55d289dae9d3a43085faeca6",
            "name":"undergraduate research assistant"
        },
        {
            "id":"55d289dae9d3a43085faed4e",
            "name":"ux designer"
        },
        {
            "id":"55d289dce9d3a43085faeeba",
            "name":"uzman"
        },
        {
            "id":"55d289dce9d3a43085faeef6",
            "name":"unternehmensinhaber"
        },
        {
            "id":"55d289dce9d3a43085faef7d",
            "name":"user experience designer"
        },
        {
            "id":"55d289dce9d3a43085faef78",
            "name":"undergraduate student"
        },
        {
            "id":"55d289dce9d3a43085faefd0",
            "name":"undergraduate researcher"
        },
        {
            "id":"55d289dce9d3a43085faf0e5",
            "name":"unit secretary"
        },
        {
            "id":"55d289dce9d3a43085faf10a",
            "name":"university lecturer"
        },
        {
            "id":"55d289dce9d3a43085faf165",
            "name":"ui designer"
        },
        {
            "id":"55d289dce9d3a43085faf1b3",
            "name":"underwriting assistant"
        },
        {
            "id":"55d289dde9d3a43085faf24f",
            "name":"uitvoerder"
        },
        {
            "id":"55d289dde9d3a43085faf29f",
            "name":"undergraduate"
        },
        {
            "id":"55d289dde9d3a43085faf2bb",
            "name":"undersköterska"
        },
        {
            "id":"55d289dde9d3a43085faf2b9",
            "name":"ui developer"
        },
        {
            "id":"55d289dde9d3a43085faf388",
            "name":"ui ux designer"
        },
        {
            "id":"55d289dee9d3a43085faf4d6",
            "name":"university professor"
        },
        {
            "id":"55d289d8e9d3a43085fae867",
            "name":"vice president"
        },
        {
            "id":"55d289d8e9d3a43085fae8ee",
            "name":"vp"
        },
        {
            "id":"55d289d8e9d3a43085fae910",
            "name":"vendedor"
        },
        {
            "id":"55d289d8e9d3a43085fae96b",
            "name":"volunteer"
        },
        {
            "id":"55d289d8e9d3a43085fae9ac",
            "name":"vendedora"
        },
        {
            "id":"55d289d8e9d3a43085fae9ed",
            "name":"ventas"
        },
        {
            "id":"55d289d9e9d3a43085faeb49",
            "name":"verpleegkundige"
        },
        {
            "id":"55d289d9e9d3a43085faeb4e",
            "name":"visual merchandiser"
        },
        {
            "id":"55d289d9e9d3a43085faeb8f",
            "name":"vice president of operations"
        },
        {
            "id":"55d289d9e9d3a43085faeba4",
            "name":"vice president of sales"
        },
        {
            "id":"55d289dae9d3a43085faec5c",
            "name":"vp sales"
        },
        {
            "id":"55d289dae9d3a43085faeca4",
            "name":"vp operations"
        },
        {
            "id":"55d289dae9d3a43085faecf0",
            "name":"vp business development"
        },
        {
            "id":"55d289dae9d3a43085faecfa",
            "name":"vigilante"
        },
        {
            "id":"55d289dae9d3a43085faed22",
            "name":"vendas"
        },
        {
            "id":"55d289dae9d3a43085faed1e",
            "name":"vice president business development"
        },
        {
            "id":"55d289dae9d3a43085faed39",
            "name":"vice president sales"
        },
        {
            "id":"55d289dae9d3a43085faed46",
            "name":"video editor"
        },
        {
            "id":"55d289dae9d3a43085faed5a",
            "name":"vice president operations"
        },
        {
            "id":"55d289dae9d3a43085faed98",
            "name":"vice president human resources"
        },
        {
            "id":"55d289d8e9d3a43085fae8ac",
            "name":"web developer"
        },
        {
            "id":"55d289d8e9d3a43085fae9b0",
            "name":"web designer"
        },
        {
            "id":"55d289d8e9d3a43085fae9d2",
            "name":"warehouse manager"
        },
        {
            "id":"55d289d8e9d3a43085faea2b",
            "name":"writer"
        },
        {
            "id":"55d289d9e9d3a43085faea7b",
            "name":"waitress"
        },
        {
            "id":"55d289d9e9d3a43085faeaa6",
            "name":"worker"
        },
        {
            "id":"55d289d9e9d3a43085faeb2d",
            "name":"warehouse supervisor"
        },
        {
            "id":"55d289d9e9d3a43085faeb4d",
            "name":"welder"
        },
        {
            "id":"55d289d9e9d3a43085faebb6",
            "name":"webmaster"
        },
        {
            "id":"55d289d9e9d3a43085faebf2",
            "name":"waiter"
        },
        {
            "id":"55d289d9e9d3a43085faec28",
            "name":"warehouse"
        },
        {
            "id":"55d289dce9d3a43085faee8d",
            "name":"wissenschaftlicher mitarbeiter"
        },
        {
            "id":"55d289dce9d3a43085faef33",
            "name":"werkvoorbereider"
        },
        {
            "id":"55d289dce9d3a43085faf0b1",
            "name":"warehouse worker"
        },
        {
            "id":"55d289dce9d3a43085faf0d4",
            "name":"warehouse associate"
        },
        {
            "id":"55d289dce9d3a43085faf142",
            "name":"web application developer"
        },
        {
            "id":"55d289dce9d3a43085faf176",
            "name":"wealth manager"
        },
        {
            "id":"55d289dde9d3a43085faf314",
            "name":"work"
        },
        {
            "id":"55d289dde9d3a43085faf3dd",
            "name":"wissenschaftliche mitarbeiterin"
        },
        {
            "id":"55d289dee9d3a43085faf465",
            "name":"webdesigner"
        },
        {
            "id":"55d289e4e9d3a43085fb0c4d",
            "name":"xray tech"
        },
        {
            "id":"55d289e5e9d3a43085fb1114",
            "name":"x-ray tech"
        },
        {
            "id":"55d289eae9d3a43085fb202d",
            "name":"x-ray technologist"
        },
        {
            "id":"55d289f8e9d3a43085fb3eae",
            "name":"xray technologist"
        },
        {
            "id":"55d289dce9d3a43085faee42",
            "name":"yönetici"
        },
        {
            "id":"55d289dce9d3a43085faf178",
            "name":"yoga instructor"
        },
        {
            "id":"55d289dee9d3a43085faf600",
            "name":"youth worker"
        },
        {
            "id":"55d289dfe9d3a43085faf825",
            "name":"yoga teacher"
        },
        {
            "id":"55d289dfe9d3a43085faf882",
            "name":"yönetmen"
        },
        {
            "id":"55d289e1e9d3a43085fb030a",
            "name":"youth pastor"
        },
        {
            "id":"55d289e1e9d3a43085fb039c",
            "name":"yönetici asistanı"
        },
        {
            "id":"55d289e2e9d3a43085fb0401",
            "name":"yazılım uzmanı"
        },
        {
            "id":"55d289e2e9d3a43085fb0582",
            "name":"yetkili"
        },
        {
            "id":"55d289e3e9d3a43085fb0b4b",
            "name":"youth counselor"
        },
        {
            "id":"55d289e6e9d3a43085fb1698",
            "name":"youth director"
        },
        {
            "id":"55d289e7e9d3a43085fb1c13",
            "name":"youth care worker"
        },
        {
            "id":"55d289e7e9d3a43085fb1c74",
            "name":"youth minister"
        },
        {
            "id":"55d289ebe9d3a43085fb2185",
            "name":"yacht broker"
        },
        {
            "id":"55d289dee9d3a43085faf529",
            "name":"zaakvoerder"
        },
        {
            "id":"55d289dee9d3a43085faf6a1",
            "name":"zone manager"
        },
        {
            "id":"55d289dfe9d3a43085faf9e3",
            "name":"zonal manager"
        },
        {
            "id":"55d289dfe9d3a43085fafa47",
            "name":"zonal sales manager"
        },
        {
            "id":"55d289e0e9d3a43085faff1c",
            "name":"zumba instructor"
        },
        {
            "id":"55d289e6e9d3a43085fb18d8",
            "name":"zonal business manager"
        },
        {
            "id":"55d289e7e9d3a43085fb1c14",
            "name":"zonal head"
        },
        {
            "id":"55d289e7e9d3a43085fb1c15",
            "name":"zorgcoördinator"
        },
        {
            "id":"55d289eae9d3a43085fb1f0e",
            "name":"zorgcoordinator"
        },
        {
            "id":"55d289ebe9d3a43085fb22c3",
            "name":"zorgkundige"
        },
        {
            "id":"55d289eee9d3a43085fb296b",
            "name":"zootecnista"
        },
        {
            "id":"55d289efe9d3a43085fb2b21",
            "name":"zelfstandig ondernemer"
        },
        {
            "id":"55d289ede9d3a43085fb27d9",
            "name":"zorgmanager"
        },
        {
            "id":"55d289efe9d3a43085fb2bba",
            "name":"zone merchandise supervisor"
        },
        {
            "id":"55d289f1e9d3a43085fb3104",
            "name":"zelfstandig"
        },
        {
            "id":"55d289f2e9d3a43085fb34d3",
            "name":"zelfstandige"
        },
        {
            "id":"55d289f2e9d3a43085fb3400",
            "name":"ziekenverzorgende"
        },
        {
            "id":"55d289f8e9d3a43085fb3eb0",
            "name":"zumba fitness instructor"
        },
        {
            "id":"55d289dee9d3a43085faf530",
            "name":"1st grade teacher"
        },
        {
            "id":"55d289eae9d3a43085fb20a8",
            "name":"1st engineer"
        },
        {
            "id":"55d289f2e9d3a43085fb3597",
            "name":"1st assistant manager"
        },
        {
            "id":"55d289f5e9d3a43085fb3ac6",
            "name":"1st lieutenant"
        },
        {
            "id":"55d289fce9d3a43085fb47bf",
            "name":"1st officer"
        },
        {
            "id":"55d28a02e9d3a43085fb567b",
            "name":"1º tenente"
        },
        {
            "id":"55d289dce9d3a43085faf16c",
            "name":"2nd grade teacher"
        },
        {
            "id":"55d289dfe9d3a43085fafa3d",
            "name":"2nd officer"
        },
        {
            "id":"55d289e0e9d3a43085fafd42",
            "name":"2nd engineer"
        },
        {
            "id":"55d289e1e9d3a43085fb0102",
            "name":"2nd lieutenant"
        },
        {
            "id":"55d289e5e9d3a43085fb10b5",
            "name":"2d artist"
        },
        {
            "id":"55d289ebe9d3a43085fb2186",
            "name":"2nd mate"
        },
        {
            "id":"55d289f0e9d3a43085fb2e68",
            "name":"2nd assistant manager"
        },
        {
            "id":"55d289fbe9d3a43085fb4575",
            "name":"2nd line support engineer"
        },
        {
            "id":"55d289fde9d3a43085fb4a3c",
            "name":"2d animator"
        },
        {
            "id":"55d289fde9d3a43085fb4b89",
            "name":"2nd vice president"
        },
        {
            "id":"55d289fbe9d3a43085fb4439",
            "name":"2nd officer dpo"
        },
        {
            "id":"55d289dce9d3a43085faefe3",
            "name":"3d artist"
        },
        {
            "id":"55d289dce9d3a43085faf13b",
            "name":"3rd grade teacher"
        },
        {
            "id":"55d289e0e9d3a43085fafbdb",
            "name":"3d animator"
        },
        {
            "id":"55d289e1e9d3a43085fb0299",
            "name":"3rd engineer"
        },
        {
            "id":"55d289e2e9d3a43085fb059d",
            "name":"3d designer"
        },
        {
            "id":"55d289e5e9d3a43085fb1079",
            "name":"3d modeler"
        },
        {
            "id":"55d289e5e9d3a43085fb114a",
            "name":"3rd officer"
        },
        {
            "id":"55d289e5e9d3a43085fb1326",
            "name":"3d generalist"
        },
        {
            "id":"55d289e9e9d3a43085fb1d91",
            "name":"3d visualizer"
        },
        {
            "id":"55d289f4e9d3a43085fb39de",
            "name":"3d character animator"
        },
        {
            "id":"55d289fde9d3a43085fb4b8a",
            "name":"3d visualiser"
        },
        {
            "id":"55d289dce9d3a43085faf05d",
            "name":"4th grade teacher"
        },
        {
            "id":"55d289f4e9d3a43085fb39df",
            "name":"4th engineer"
        },
        {
            "id":"55d289dce9d3a43085faf0c9",
            "name":"5th grade teacher"
        },
        {
            "id":"55d289e0e9d3a43085faff1d",
            "name":"6th grade teacher"
        },
        {
            "id":"55d289efe9d3a43085fb2b24",
            "name":"6th grade math teacher"
        },
        {
            "id":"55d289f2e9d3a43085fb3670",
            "name":"6 sigma black belt"
        },
        {
            "id":"55d289fbe9d3a43085fb4576",
            "name":"6th grade science teacher"
        },
        {
            "id":"55d289ece9d3a43085fb241f",
            "name":"7th grade math teacher"
        },
        {
            "id":"55d289f7e9d3a43085fb3dbb",
            "name":"7th grade science teacher"
        },
        {
            "id":"55d289ece9d3a43085fb24ae",
            "name":"8th grade science teacher"
        },
        {
            "id":"55d289f4e9d3a43085fb39e0",
            "name":"8th grade math teacher"
        },
        {
            "id":"55d289e3e9d3a43085fb0b21",
            "name":"911 dispatcher"
        }
    ];
    jobTitles = _.uniq(jobTitles, 'name');
    jobTitles = jobTitles.sort((a, b) => {
        if (a.name.length < b.name.length) {
            return -1;
        }
    });

    // Set up static locations array
    let locations = [
        {
            "name": "APAC",
            "category": "Geo-Area"
        },
        {
            "name": "Ahmedabad, India",
            "category": "City"
        },
        {
            "name": "Alabama, US",
            "category": "State"
        },
        {
            "name": "Alberta, Canada",
            "category": "State"
        },
        {
            "name": "Albuquerque, New Mexico",
            "category": "City"
        },
        {
            "name": "Alexandria, Virginia",
            "category": "City"
        },
        {
            "name": "Americas",
            "category": "Geo-Area"
        },
        {
            "name": "Americas",
            "category": "Geo-Area"
        },
        {
            "name": "Amsterdam, Netherlands",
            "category": "City"
        },
        {
            "name": "Antwerp, Belgium",
            "category": "City"
        },
        {
            "name": "Aquitaine, France",
            "category": "State"
        },
        {
            "name": "Aquitaine-Limousin-Poitou-Charentes, France",
            "category": "State"
        },
        {
            "name": "Argentina",
            "category": "Country"
        },
        {
            "name": "Arizona, US",
            "category": "State"
        },
        {
            "name": "Arkansas, US",
            "category": "State"
        },
        {
            "name": "Asia",
            "category": "Geo-Area"
        },
        {
            "name": "Atlanta, Georgia",
            "category": "City"
        },
        {
            "name": "Austin, Texas",
            "category": "City"
        },
        {
            "name": "Australia",
            "category": "Country"
        },
        {
            "name": "Austria",
            "category": "Country"
        },
        {
            "name": "Auvergne-Rhône-Alpes, France",
            "category": "State"
        },
        {
            "name": "Baden-Baden, Germany",
            "category": "City"
        },
        {
            "name": "Baden-Württemberg, Germany",
            "category": "State"
        },
        {
            "name": "Baltimore, Maryland",
            "category": "City"
        },
        {
            "name": "Bangkok, Thailand",
            "category": "State"
        },
        {
            "name": "Bavaria, Germany",
            "category": "State"
        },
        {
            "name": "Beijing, China",
            "category": "State"
        },
        {
            "name": "Belgium",
            "category": "Country"
        },
        {
            "name": "Bengaluru, India",
            "category": "City"
        },
        {
            "name": "Bergen, Germany",
            "category": "City"
        },
        {
            "name": "Berlin, Germany",
            "category": "State"
        },
        {
            "name": "Birmingham, United Kingdom",
            "category": "City"
        },
        {
            "name": "Bogota, Colombia",
            "category": "State"
        },
        {
            "name": "Boston, Massachusetts",
            "category": "City"
        },
        {
            "name": "Brandenburg, Germany",
            "category": "State"
        },
        {
            "name": "Brazil",
            "category": "Country"
        },
        {
            "name": "Bremen, Germany",
            "category": "State"
        },
        {
            "name": "British Columbia, Canada",
            "category": "State"
        },
        {
            "name": "Brussels, Belgium",
            "category": "State"
        },
        {
            "name": "Bucharest, Romania",
            "category": "State"
        },
        {
            "name": "Buffalo/Niagara, New York Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Calgary, Canada",
            "category": "City"
        },
        {
            "name": "California, US",
            "category": "State"
        },
        {
            "name": "Cambridge, Massachusetts",
            "category": "City"
        },
        {
            "name": "Canada",
            "category": "Country"
        },
        {
            "name": "Cape Town, South Africa",
            "category": "City"
        },
        {
            "name": "Chantilly, Virginia",
            "category": "City"
        },
        {
            "name": "Charlotte, North Carolina",
            "category": "City"
        },
        {
            "name": "Chattanooga, Tennessee",
            "category": "City"
        },
        {
            "name": "Chengdu, China",
            "category": "City"
        },
        {
            "name": "Chennai, India",
            "category": "City"
        },
        {
            "name": "Chicago, Illinois",
            "category": "City"
        },
        {
            "name": "China",
            "category": "Country"
        },
        {
            "name": "Cincinnati, Ohio",
            "category": "City"
        },
        {
            "name": "Clamart, France",
            "category": "City"
        },
        {
            "name": "Cleveland, Ohio",
            "category": "City"
        },
        {
            "name": "Cologne, Germany",
            "category": "City"
        },
        {
            "name": "Colombia",
            "category": "Country"
        },
        {
            "name": "Colorado Springs, Colorado",
            "category": "City"
        },
        {
            "name": "Columbia, South Carolina",
            "category": "City"
        },
        {
            "name": "Columbus, Ohio",
            "category": "City"
        },
        {
            "name": "Czech Republic",
            "category": "Country"
        },
        {
            "name": "Dallas, Texas",
            "category": "City"
        },
        {
            "name": "Dallas/Fort Worth Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Dallas/Fort Worth Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Darmstadt, Germany",
            "category": "City"
        },
        {
            "name": "Dayton, Ohio",
            "category": "City"
        },
        {
            "name": "Dearborn, Michigan",
            "category": "City"
        },
        {
            "name": "Deerfield Beach, Florida",
            "category": "City"
        },
        {
            "name": "Delaware, US",
            "category": "State"
        },
        {
            "name": "Delhi, India",
            "category": "State"
        },
        {
            "name": "Denmark",
            "category": "Country"
        },
        {
            "name": "Denver, Colorado",
            "category": "City"
        },
        {
            "name": "Des Moines, Iowa",
            "category": "City"
        },
        {
            "name": "Detroit, Michigan",
            "category": "City"
        },
        {
            "name": "District of Columbia, US",
            "category": "State"
        },
        {
            "name": "Doha, Qatar",
            "category": "State"
        },
        {
            "name": "Dortmund, Germany",
            "category": "City"
        },
        {
            "name": "Dresden, Germany",
            "category": "City"
        },
        {
            "name": "Dubai, United Arab Emirates",
            "category": "State"
        },
        {
            "name": "Dublin, Ireland",
            "category": "State"
        },
        {
            "name": "Durham, North Carolina",
            "category": "City"
        },
        {
            "name": "Düsseldorf, Germany",
            "category": "City"
        },
        {
            "name": "EMEA",
            "category": "Geo-Area"
        },
        {
            "name": "EMEA",
            "category": "Geo-Area"
        },
        {
            "name": "Eden Prairie, Minnesota",
            "category": "City"
        },
        {
            "name": "Edinburgh, United Kingdom",
            "category": "City"
        },
        {
            "name": "Edison, New Jersey",
            "category": "City"
        },
        {
            "name": "Edmonton, Canada",
            "category": "City"
        },
        {
            "name": "Egypt",
            "category": "Country"
        },
        {
            "name": "Eindhoven, Netherlands",
            "category": "City"
        },
        {
            "name": "El Paso, Texas",
            "category": "City"
        },
        {
            "name": "El Segundo, California",
            "category": "City"
        },
        {
            "name": "Emilia-Romagna, Italy",
            "category": "State"
        },
        {
            "name": "England, United Kingdom",
            "category": "State"
        },
        {
            "name": "Englewood, Colorado",
            "category": "City"
        },
        {
            "name": "Erfurt, Germany",
            "category": "City"
        },
        {
            "name": "Ernakulam, India",
            "category": "City"
        },
        {
            "name": "Essen, Germany",
            "category": "City"
        },
        {
            "name": "Estado de México, Mexico",
            "category": "State"
        },
        {
            "name": "Europe",
            "category": "Geo-Area"
        },
        {
            "name": "Europe",
            "category": "Geo-Area"
        },
        {
            "name": "European Union",
            "category": "Geo-Area"
        },
        {
            "name": "European Union",
            "category": "Geo-Area"
        },
        {
            "name": "Evansville, Indiana",
            "category": "City"
        },
        {
            "name": "Everett, Washington",
            "category": "City"
        },
        {
            "name": "Fairfax, Virginia",
            "category": "City"
        },
        {
            "name": "Falls Church, Virginia",
            "category": "City"
        },
        {
            "name": "Fargo, North Dakota",
            "category": "City"
        },
        {
            "name": "Federal Capital Territory, Nigeria",
            "category": "State"
        },
        {
            "name": "Federal District, Mexico",
            "category": "State"
        },
        {
            "name": "Federal Territory of Kuala Lumpur, Malaysia",
            "category": "State"
        },
        {
            "name": "Finland",
            "category": "Country"
        },
        {
            "name": "Flanders, Belgium",
            "category": "State"
        },
        {
            "name": "Florida, US",
            "category": "State"
        },
        {
            "name": "Fort Lauderdale, Florida",
            "category": "City"
        },
        {
            "name": "Fort Myers, Florida",
            "category": "City"
        },
        {
            "name": "Fort Wayne, Indiana",
            "category": "City"
        },
        {
            "name": "Fort Worth, Texas",
            "category": "City"
        },
        {
            "name": "France",
            "category": "Country"
        },
        {
            "name": "Frankfurt, Germany",
            "category": "City"
        },
        {
            "name": "Freiburg, Germany",
            "category": "City"
        },
        {
            "name": "Fremont, California",
            "category": "City"
        },
        {
            "name": "Fresno, California",
            "category": "City"
        },
        {
            "name": "Fujian, China",
            "category": "State"
        },
        {
            "name": "Fuzhou, China",
            "category": "City"
        },
        {
            "name": "Georgia, US",
            "category": "State"
        },
        {
            "name": "Germany",
            "category": "Country"
        },
        {
            "name": "Germany",
            "category": "Country"
        },
        {
            "name": "Greater Atlanta Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Boston Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Chicago Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Denver Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Denver Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Houston Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Houston Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Los Angeles Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Los Angeles Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Memphis Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Milwaukee Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Minneapolis-St. Paul Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Nashville Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater New York City Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater New York City Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Omaha Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Philadelphia Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Philadelphia Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Salt Lake City Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater San Diego Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater Seattle Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Greater St. Louis Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Guangdong, China",
            "category": "State"
        },
        {
            "name": "Hamburg, Germany",
            "category": "State"
        },
        {
            "name": "Hangzhou, China",
            "category": "City"
        },
        {
            "name": "Hanoi, Vietnam",
            "category": "State"
        },
        {
            "name": "Hanover, Germany",
            "category": "City"
        },
        {
            "name": "Hartford, Connecticut",
            "category": "City"
        },
        {
            "name": "Haryana, India",
            "category": "State"
        },
        {
            "name": "Hawaii, US",
            "category": "State"
        },
        {
            "name": "Herndon, Virginia",
            "category": "City"
        },
        {
            "name": "Hesse, Germany",
            "category": "State"
        },
        {
            "name": "Hlavní město Praha, Czech Republic",
            "category": "State"
        },
        {
            "name": "Ho Chi Minh City, Vietnam",
            "category": "City"
        },
        {
            "name": "Ho Chi Minh, Vietnam",
            "category": "State"
        },
        {
            "name": "Hong Kong",
            "category": "Country"
        },
        {
            "name": "Honolulu, Hawaii",
            "category": "City"
        },
        {
            "name": "Hoograven, Netherlands",
            "category": "City"
        },
        {
            "name": "Houston, Texas",
            "category": "City"
        },
        {
            "name": "Hubei, China",
            "category": "State"
        },
        {
            "name": "Hungary",
            "category": "Country"
        },
        {
            "name": "Huntsville, Alabama",
            "category": "City"
        },
        {
            "name": "Hyderabad, India",
            "category": "City"
        },
        {
            "name": "Ibaraki Prefecture, Japan",
            "category": "State"
        },
        {
            "name": "Idaho, US",
            "category": "State"
        },
        {
            "name": "Ilfov County, Romania",
            "category": "State"
        },
        {
            "name": "Illinois, US",
            "category": "State"
        },
        {
            "name": "India",
            "category": "Country"
        },
        {
            "name": "India",
            "category": "Country"
        },
        {
            "name": "Indiana, US",
            "category": "State"
        },
        {
            "name": "Indianapolis, Indiana",
            "category": "City"
        },
        {
            "name": "Indonesia",
            "category": "Country"
        },
        {
            "name": "Indore, India",
            "category": "City"
        },
        {
            "name": "Ingolstadt, Germany",
            "category": "City"
        },
        {
            "name": "Iowa, US",
            "category": "State"
        },
        {
            "name": "Ireland",
            "category": "Country"
        },
        {
            "name": "Irkutsk Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Irkutsk, Russia",
            "category": "City"
        },
        {
            "name": "Irvine, California",
            "category": "City"
        },
        {
            "name": "Irving, Texas",
            "category": "City"
        },
        {
            "name": "Israel",
            "category": "Country"
        },
        {
            "name": "Italy",
            "category": "Country"
        },
        {
            "name": "Izhevsk, Russia",
            "category": "City"
        },
        {
            "name": "Jackson, Michigan",
            "category": "City"
        },
        {
            "name": "Jackson, Mississippi",
            "category": "City"
        },
        {
            "name": "Jacksonville, Florida",
            "category": "City"
        },
        {
            "name": "Jaipur, India",
            "category": "City"
        },
        {
            "name": "Jakarta, Indonesia",
            "category": "State"
        },
        {
            "name": "Jalisco, Mexico",
            "category": "State"
        },
        {
            "name": "Japan",
            "category": "Country"
        },
        {
            "name": "Jeddah, Saudi Arabia",
            "category": "City"
        },
        {
            "name": "Jersey City, New Jersey",
            "category": "City"
        },
        {
            "name": "Jerusalem, Israel",
            "category": "City"
        },
        {
            "name": "Jharkhand, India",
            "category": "State"
        },
        {
            "name": "Jiangsu, China",
            "category": "State"
        },
        {
            "name": "Jiangxi, China",
            "category": "State"
        },
        {
            "name": "Jilin, China",
            "category": "State"
        },
        {
            "name": "Jinan, China",
            "category": "City"
        },
        {
            "name": "Jinhua, China",
            "category": "City"
        },
        {
            "name": "Johannesburg, South Africa",
            "category": "City"
        },
        {
            "name": "Joliet, Illinois",
            "category": "City"
        },
        {
            "name": "Jonkoping County, Sweden",
            "category": "State"
        },
        {
            "name": "Juriquilla, Mexico",
            "category": "City"
        },
        {
            "name": "Kanagawa Prefecture, Japan",
            "category": "State"
        },
        {
            "name": "Kansas City, Kansas",
            "category": "City"
        },
        {
            "name": "Kansas City, Missouri",
            "category": "City"
        },
        {
            "name": "Kansas, US",
            "category": "State"
        },
        {
            "name": "Karlsruhe, Germany",
            "category": "City"
        },
        {
            "name": "Karnataka, India",
            "category": "State"
        },
        {
            "name": "Kazan, Russia",
            "category": "City"
        },
        {
            "name": "Kentucky, US",
            "category": "State"
        },
        {
            "name": "Kerala, India",
            "category": "State"
        },
        {
            "name": "Knoxville, Tennessee",
            "category": "City"
        },
        {
            "name": "Kolkata, India",
            "category": "City"
        },
        {
            "name": "Koog aan de Zaan, Netherlands",
            "category": "City"
        },
        {
            "name": "Kortrijk, Belgium",
            "category": "City"
        },
        {
            "name": "Krakow, Poland",
            "category": "City"
        },
        {
            "name": "Krasnodar Krai, Russia",
            "category": "State"
        },
        {
            "name": "Krasnodar, Russia",
            "category": "City"
        },
        {
            "name": "Krasnoyarsk Krai, Russia",
            "category": "State"
        },
        {
            "name": "Kuala Lumpur, Malaysia",
            "category": "City"
        },
        {
            "name": "Kuwait",
            "category": "Country"
        },
        {
            "name": "Kyiv city, Ukraine",
            "category": "State"
        },
        {
            "name": "Lagos, Nigeria",
            "category": "State"
        },
        {
            "name": "Leeds, United Kingdom",
            "category": "City"
        },
        {
            "name": "Leicester, United Kingdom",
            "category": "City"
        },
        {
            "name": "Leipzig, Germany",
            "category": "City"
        },
        {
            "name": "Lesser Poland Voivodeship, Poland",
            "category": "State"
        },
        {
            "name": "Lexington, Kentucky",
            "category": "City"
        },
        {
            "name": "Liaoning, China",
            "category": "State"
        },
        {
            "name": "Lima, Peru",
            "category": "State"
        },
        {
            "name": "Limburg, Netherlands",
            "category": "State"
        },
        {
            "name": "Lisbon, Portugal",
            "category": "State"
        },
        {
            "name": "Littleton, Colorado",
            "category": "City"
        },
        {
            "name": "Lombardy, Italy",
            "category": "State"
        },
        {
            "name": "London, United Kingdom",
            "category": "City"
        },
        {
            "name": "Long Beach, California",
            "category": "City"
        },
        {
            "name": "Los Angeles, California",
            "category": "City"
        },
        {
            "name": "Louisiana, US",
            "category": "State"
        },
        {
            "name": "Louisville, Kentucky",
            "category": "City"
        },
        {
            "name": "Lower Saxony, Germany",
            "category": "State"
        },
        {
            "name": "Lower Silesian Voivodeship, Poland",
            "category": "State"
        },
        {
            "name": "Lyon, France",
            "category": "City"
        },
        {
            "name": "Maharashtra, India",
            "category": "State"
        },
        {
            "name": "Maine, US",
            "category": "State"
        },
        {
            "name": "Manchester, United Kingdom",
            "category": "City"
        },
        {
            "name": "Maryland, US",
            "category": "State"
        },
        {
            "name": "Masovian Voivodeship, Poland",
            "category": "State"
        },
        {
            "name": "Massachusetts, US",
            "category": "State"
        },
        {
            "name": "Melbourne, Australia",
            "category": "City"
        },
        {
            "name": "Mexico",
            "category": "Country"
        },
        {
            "name": "Miami, Florida",
            "category": "City"
        },
        {
            "name": "Miami/Fort Lauderdale Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Miami/Fort Lauderdale Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Michigan, US",
            "category": "State"
        },
        {
            "name": "Milwaukee, Wisconsin",
            "category": "City"
        },
        {
            "name": "Minneapolis, Minnesota",
            "category": "City"
        },
        {
            "name": "Minnesota, US",
            "category": "State"
        },
        {
            "name": "Mississippi, US",
            "category": "State"
        },
        {
            "name": "Missouri, US",
            "category": "State"
        },
        {
            "name": "Moscow Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Moscow, Russia",
            "category": "State"
        },
        {
            "name": "Mumbai, India",
            "category": "City"
        },
        {
            "name": "Munich, Germany",
            "category": "City"
        },
        {
            "name": "Nalgonda, India",
            "category": "City"
        },
        {
            "name": "Nashville, Tennessee",
            "category": "City"
        },
        {
            "name": "Nebraska, US",
            "category": "State"
        },
        {
            "name": "Netherlands",
            "category": "Country"
        },
        {
            "name": "Nevada, US",
            "category": "State"
        },
        {
            "name": "New Delhi, India",
            "category": "City"
        },
        {
            "name": "New Hampshire, US",
            "category": "State"
        },
        {
            "name": "New Jersey, US",
            "category": "State"
        },
        {
            "name": "New Mexico, US",
            "category": "State"
        },
        {
            "name": "New South Wales, Australia",
            "category": "State"
        },
        {
            "name": "New York, New York",
            "category": "City"
        },
        {
            "name": "New York, US",
            "category": "State"
        },
        {
            "name": "Nigeria",
            "category": "Country"
        },
        {
            "name": "Nord-Pas-de-Calais, France",
            "category": "State"
        },
        {
            "name": "North America",
            "category": "Geo-Area"
        },
        {
            "name": "North America",
            "category": "Geo-Area"
        },
        {
            "name": "North Brabant, Netherlands",
            "category": "State"
        },
        {
            "name": "North Carolina, US",
            "category": "State"
        },
        {
            "name": "North Dakota, US",
            "category": "State"
        },
        {
            "name": "North Holland, Netherlands",
            "category": "State"
        },
        {
            "name": "North Rhine-Westphalia, Germany",
            "category": "State"
        },
        {
            "name": "Oakland, California",
            "category": "City"
        },
        {
            "name": "Ohio, US",
            "category": "State"
        },
        {
            "name": "Oklahoma City, Oklahoma",
            "category": "City"
        },
        {
            "name": "Oklahoma, US",
            "category": "State"
        },
        {
            "name": "Olomouc Region, Czech Republic",
            "category": "State"
        },
        {
            "name": "Omaha, Nebraska",
            "category": "City"
        },
        {
            "name": "Omsk Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Omsk, Russia",
            "category": "City"
        },
        {
            "name": "Ontario, Canada",
            "category": "State"
        },
        {
            "name": "Orange, California",
            "category": "City"
        },
        {
            "name": "Oregon, US",
            "category": "State"
        },
        {
            "name": "Orlando, Florida",
            "category": "City"
        },
        {
            "name": "Osaka Prefecture, Japan",
            "category": "State"
        },
        {
            "name": "Osaka, Japan",
            "category": "City"
        },
        {
            "name": "Oslo, Norway",
            "category": "State"
        },
        {
            "name": "Osnabrück, Germany",
            "category": "City"
        },
        {
            "name": "Ottawa, Canada",
            "category": "City"
        },
        {
            "name": "Overijssel, Netherlands",
            "category": "State"
        },
        {
            "name": "Overland Park, Kansas",
            "category": "City"
        },
        {
            "name": "Oxford, United Kingdom",
            "category": "City"
        },
        {
            "name": "Palo Alto, California",
            "category": "City"
        },
        {
            "name": "Paris, France",
            "category": "City"
        },
        {
            "name": "Pays de la Loire, France",
            "category": "State"
        },
        {
            "name": "Pennsylvania, US",
            "category": "State"
        },
        {
            "name": "Peru",
            "category": "Country"
        },
        {
            "name": "Philadelphia, Pennsylvania",
            "category": "City"
        },
        {
            "name": "Philippines",
            "category": "Country"
        },
        {
            "name": "Phoenix, Arizona",
            "category": "City"
        },
        {
            "name": "Pittsburgh, Pennsylvania",
            "category": "City"
        },
        {
            "name": "Plano, Texas",
            "category": "City"
        },
        {
            "name": "Poland",
            "category": "Country"
        },
        {
            "name": "Portland, Oregon",
            "category": "City"
        },
        {
            "name": "Porto District, Portugal",
            "category": "State"
        },
        {
            "name": "Porto, Portugal",
            "category": "City"
        },
        {
            "name": "Portugal",
            "category": "Country"
        },
        {
            "name": "Prague, Czech Republic",
            "category": "State"
        },
        {
            "name": "Provence-Alpes-Côte d'Azur, France",
            "category": "State"
        },
        {
            "name": "Puebla, Mexico",
            "category": "State"
        },
        {
            "name": "Puerto Rico",
            "category": "Country"
        },
        {
            "name": "Pune, India",
            "category": "City"
        },
        {
            "name": "Qatar",
            "category": "Country"
        },
        {
            "name": "Qingdao, China",
            "category": "City"
        },
        {
            "name": "Qinghai, China",
            "category": "State"
        },
        {
            "name": "Qiqiha'er, China",
            "category": "City"
        },
        {
            "name": "Quantico, Virginia",
            "category": "City"
        },
        {
            "name": "Quanzhou, China",
            "category": "City"
        },
        {
            "name": "Quebec City, Canada",
            "category": "City"
        },
        {
            "name": "Quebec, Canada",
            "category": "State"
        },
        {
            "name": "Queensbury, New York",
            "category": "City"
        },
        {
            "name": "Queensland, Australia",
            "category": "State"
        },
        {
            "name": "Querétaro, Mexico",
            "category": "State"
        },
        {
            "name": "Quezon City, Philippines",
            "category": "City"
        },
        {
            "name": "Quimper, France",
            "category": "City"
        },
        {
            "name": "Quincy, California",
            "category": "City"
        },
        {
            "name": "Quincy, Illinois",
            "category": "City"
        },
        {
            "name": "Quincy, Massachusetts",
            "category": "City"
        },
        {
            "name": "Quincy-sous-Sénart, France",
            "category": "City"
        },
        {
            "name": "Quintana Roo, Mexico",
            "category": "State"
        },
        {
            "name": "Qujing, China",
            "category": "City"
        },
        {
            "name": "Rajasthan, India",
            "category": "State"
        },
        {
            "name": "Raleigh, North Carolina",
            "category": "City"
        },
        {
            "name": "Redwood City, California",
            "category": "City"
        },
        {
            "name": "Reno, Nevada",
            "category": "City"
        },
        {
            "name": "Republic of Bashkortostan, Russia",
            "category": "State"
        },
        {
            "name": "Reston, Virginia",
            "category": "City"
        },
        {
            "name": "Rhineland-Palatinate, Germany",
            "category": "State"
        },
        {
            "name": "Rhode Island, US",
            "category": "State"
        },
        {
            "name": "Rhone-Alpes, France",
            "category": "State"
        },
        {
            "name": "Rhône-Alpes, France",
            "category": "State"
        },
        {
            "name": "Richmond, Virginia",
            "category": "City"
        },
        {
            "name": "Rio de Janeiro, Brazil",
            "category": "City"
        },
        {
            "name": "Riyadh Province, Saudi Arabia",
            "category": "State"
        },
        {
            "name": "Riyadh, Saudi Arabia",
            "category": "City"
        },
        {
            "name": "Rochester, New York",
            "category": "City"
        },
        {
            "name": "Rockville, Maryland",
            "category": "City"
        },
        {
            "name": "Romania",
            "category": "Country"
        },
        {
            "name": "Rostov Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Rotterdam, Netherlands",
            "category": "City"
        },
        {
            "name": "Russia",
            "category": "Country"
        },
        {
            "name": "Russia",
            "category": "Country"
        },
        {
            "name": "Saint Petersburg, Russia",
            "category": "State"
        },
        {
            "name": "Samara Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Samut Prakan, Thailand",
            "category": "State"
        },
        {
            "name": "San Francisco Bay Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "San Juan, Puerto Rico",
            "category": "State"
        },
        {
            "name": "Saxony, Germany",
            "category": "State"
        },
        {
            "name": "Saxony-Anhalt, Germany",
            "category": "State"
        },
        {
            "name": "Schleswig-Holstein, Germany",
            "category": "State"
        },
        {
            "name": "Scotland, United Kingdom",
            "category": "State"
        },
        {
            "name": "Shandong, China",
            "category": "State"
        },
        {
            "name": "Shanghai, China",
            "category": "State"
        },
        {
            "name": "Sichuan, China",
            "category": "State"
        },
        {
            "name": "Silesian Voivodeship, Poland",
            "category": "State"
        },
        {
            "name": "South Carolina, US",
            "category": "State"
        },
        {
            "name": "South Dakota, US",
            "category": "State"
        },
        {
            "name": "South Holland, Netherlands",
            "category": "State"
        },
        {
            "name": "South Moravian Region, Czech Republic",
            "category": "State"
        },
        {
            "name": "State of Rio de Janeiro, Brazil",
            "category": "State"
        },
        {
            "name": "State of São Paulo, Brazil",
            "category": "State"
        },
        {
            "name": "Stockholm County, Sweden",
            "category": "State"
        },
        {
            "name": "Sverdlovsk Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Taipei, Taiwan",
            "category": "City"
        },
        {
            "name": "Taiwan",
            "category": "Country"
        },
        {
            "name": "Tallahassee, Florida",
            "category": "City"
        },
        {
            "name": "Tamil Nadu, India",
            "category": "State"
        },
        {
            "name": "Tampa, Florida",
            "category": "City"
        },
        {
            "name": "Tampa/St. Petersburg, Florida Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Tatarstan, Russia",
            "category": "State"
        },
        {
            "name": "Telangana, India",
            "category": "State"
        },
        {
            "name": "Tempe, Arizona",
            "category": "City"
        },
        {
            "name": "Tennessee, US",
            "category": "State"
        },
        {
            "name": "Texas, US",
            "category": "State"
        },
        {
            "name": "Texas, US",
            "category": "State"
        },
        {
            "name": "Thailand",
            "category": "Country"
        },
        {
            "name": "Thuringia, Germany",
            "category": "State"
        },
        {
            "name": "Tianjin, China",
            "category": "State"
        },
        {
            "name": "Tokyo, Japan",
            "category": "State"
        },
        {
            "name": "Toronto, Canada",
            "category": "City"
        },
        {
            "name": "Troy, Michigan",
            "category": "City"
        },
        {
            "name": "Tucson, Arizona",
            "category": "City"
        },
        {
            "name": "Tulsa, Oklahoma",
            "category": "City"
        },
        {
            "name": "Turkey",
            "category": "Country"
        },
        {
            "name": "Udmurt Republic, Russia",
            "category": "State"
        },
        {
            "name": "Udmurtskaja Respublika, Russia",
            "category": "State"
        },
        {
            "name": "Ufa, Russia",
            "category": "City"
        },
        {
            "name": "Ukraine",
            "category": "Country"
        },
        {
            "name": "Ulm, Germany",
            "category": "City"
        },
        {
            "name": "Ulyanovsk Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Ulyanovsk, Russia",
            "category": "City"
        },
        {
            "name": "United Arab Emirates",
            "category": "Country"
        },
        {
            "name": "United Kingdom",
            "category": "Country"
        },
        {
            "name": "United Kingdom",
            "category": "Country"
        },
        {
            "name": "United States",
            "category": "Country"
        },
        {
            "name": "United States",
            "category": "Country"
        },
        {
            "name": "Upper Austria, Austria",
            "category": "State"
        },
        {
            "name": "Upper Normandy, France",
            "category": "State"
        },
        {
            "name": "Uppsala County, Sweden",
            "category": "State"
        },
        {
            "name": "Uppsala, Sweden",
            "category": "City"
        },
        {
            "name": "Urbana, Illinois",
            "category": "City"
        },
        {
            "name": "Utah, US",
            "category": "State"
        },
        {
            "name": "Utrecht, Netherlands",
            "category": "State"
        },
        {
            "name": "Uttar Pradesh, India",
            "category": "State"
        },
        {
            "name": "Uttarakhand, India",
            "category": "State"
        },
        {
            "name": "Uusimaa, Finland",
            "category": "State"
        },
        {
            "name": "Valencian Community, Spain",
            "category": "State"
        },
        {
            "name": "Valle de Chalco Solidaridad, Mexico",
            "category": "City"
        },
        {
            "name": "Vancouver, Canada",
            "category": "City"
        },
        {
            "name": "Vancouver, Washington",
            "category": "City"
        },
        {
            "name": "Veracruz, Mexico",
            "category": "State"
        },
        {
            "name": "Vermont, US",
            "category": "State"
        },
        {
            "name": "Versailles, France",
            "category": "City"
        },
        {
            "name": "Victoria, Australia",
            "category": "State"
        },
        {
            "name": "Vienna, Austria",
            "category": "State"
        },
        {
            "name": "Vienna, Virginia",
            "category": "City"
        },
        {
            "name": "Vietnam",
            "category": "Country"
        },
        {
            "name": "Vilvoorde, Belgium",
            "category": "City"
        },
        {
            "name": "Virginia Beach, Virginia",
            "category": "City"
        },
        {
            "name": "Virginia, US",
            "category": "State"
        },
        {
            "name": "Vlaanderen, Belgium",
            "category": "State"
        },
        {
            "name": "Vladimir Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Volgograd Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Voronezh Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Voronezh, Russia",
            "category": "City"
        },
        {
            "name": "Västra Götaland County, Sweden",
            "category": "State"
        },
        {
            "name": "Wales, United Kingdom",
            "category": "State"
        },
        {
            "name": "Walloon Region, Belgium",
            "category": "State"
        },
        {
            "name": "Warsaw, Poland",
            "category": "City"
        },
        {
            "name": "Washington D.C. Metro Area",
            "category": "Metropolitan Area"
        },
        {
            "name": "Washington, District of Columbia",
            "category": "City"
        },
        {
            "name": "Washington, US",
            "category": "State"
        },
        {
            "name": "West Bengal, India",
            "category": "State"
        },
        {
            "name": "West Palm Beach, Florida",
            "category": "City"
        },
        {
            "name": "West Virginia, US",
            "category": "State"
        },
        {
            "name": "Western Australia, Australia",
            "category": "State"
        },
        {
            "name": "Western Cape, South Africa",
            "category": "State"
        },
        {
            "name": "Wetering, Netherlands",
            "category": "City"
        },
        {
            "name": "Whitby, Canada",
            "category": "City"
        },
        {
            "name": "Wichita, Kansas",
            "category": "City"
        },
        {
            "name": "Winnipeg, Canada",
            "category": "City"
        },
        {
            "name": "Wisconsin, US",
            "category": "State"
        },
        {
            "name": "Worcester, Massachusetts",
            "category": "City"
        },
        {
            "name": "Wrocław, Poland",
            "category": "City"
        },
        {
            "name": "Wuhan, China",
            "category": "City"
        },
        {
            "name": "Wyoming, US",
            "category": "State"
        },
        {
            "name": "Xalapa, Mexico",
            "category": "City"
        },
        {
            "name": "Xambioá, Brazil",
            "category": "City"
        },
        {
            "name": "Xanten, Germany",
            "category": "City"
        },
        {
            "name": "Xanxerê, Brazil",
            "category": "City"
        },
        {
            "name": "Xenia, Illinois",
            "category": "City"
        },
        {
            "name": "Xenia, Ohio",
            "category": "City"
        },
        {
            "name": "Xi'an, China",
            "category": "City"
        },
        {
            "name": "Xiamen, China",
            "category": "City"
        },
        {
            "name": "Xiaogan, China",
            "category": "City"
        },
        {
            "name": "Xicoténcatl, Mexico",
            "category": "City"
        },
        {
            "name": "Xilxes, Spain",
            "category": "City"
        },
        {
            "name": "Xingtai, China",
            "category": "City"
        },
        {
            "name": "Xining, China",
            "category": "City"
        },
        {
            "name": "Xinjiang Weiwuerzizhiqu, China",
            "category": "State"
        },
        {
            "name": "Xinjiang, China",
            "category": "State"
        },
        {
            "name": "Xirivella, Spain",
            "category": "City"
        },
        {
            "name": "Xizang (Tibet), China",
            "category": "State"
        },
        {
            "name": "Xochihuehuetlán, Mexico",
            "category": "City"
        },
        {
            "name": "Xuzhou, China",
            "category": "City"
        },
        {
            "name": "Xàtiva, Spain",
            "category": "City"
        },
        {
            "name": "Yakima, Washington",
            "category": "City"
        },
        {
            "name": "Yamaguchi Prefecture, Japan",
            "category": "State"
        },
        {
            "name": "Yamalo-Nenets Autonomous Okrug, Russia",
            "category": "State"
        },
        {
            "name": "Yantai, China",
            "category": "City"
        },
        {
            "name": "Yaroslavl Oblast, Russia",
            "category": "State"
        },
        {
            "name": "Yaroslavl, Russia",
            "category": "City"
        },
        {
            "name": "Yekaterinburg, Russia",
            "category": "City"
        },
        {
            "name": "Yokohama, Japan",
            "category": "City"
        },
        {
            "name": "Yonkers, New York",
            "category": "City"
        },
        {
            "name": "York, Pennsylvania",
            "category": "City"
        },
        {
            "name": "York, United Kingdom",
            "category": "City"
        },
        {
            "name": "Yoshkar-Ola, Russia",
            "category": "City"
        },
        {
            "name": "Youngstown, Ohio",
            "category": "City"
        },
        {
            "name": "Ypenburg, Netherlands",
            "category": "City"
        },
        {
            "name": "Ypres, Belgium",
            "category": "City"
        },
        {
            "name": "Ypsilanti, Michigan",
            "category": "City"
        },
        {
            "name": "Yucaipa, California",
            "category": "City"
        },
        {
            "name": "Yucatán, Mexico",
            "category": "State"
        },
        {
            "name": "Yuma, Arizona",
            "category": "City"
        },
        {
            "name": "Yunnan, China",
            "category": "State"
        },
        {
            "name": "Zaandam, Netherlands",
            "category": "City"
        },
        {
            "name": "Zabaykalsky Krai, Russia",
            "category": "State"
        },
        {
            "name": "Zanesville, Ohio",
            "category": "City"
        },
        {
            "name": "Zapopan, Mexico",
            "category": "City"
        },
        {
            "name": "Zaragoza, Spain",
            "category": "City"
        },
        {
            "name": "Zaventem, Belgium",
            "category": "City"
        },
        {
            "name": "Zeeland, Netherlands",
            "category": "City"
        },
        {
            "name": "Zelenograd, Russia",
            "category": "City"
        },
        {
            "name": "Zephyrhills, Florida",
            "category": "City"
        },
        {
            "name": "Zhejiang, China",
            "category": "State"
        },
        {
            "name": "Zhuhai, China",
            "category": "City"
        },
        {
            "name": "Zielona Gora, Poland",
            "category": "City"
        },
        {
            "name": "Zionsville, Indiana",
            "category": "City"
        },
        {
            "name": "Zlin Region, Czech Republic",
            "category": "State"
        },
        {
            "name": "Zuid-Holland, Netherlands",
            "category": "State"
        },
        {
            "name": "Zunyi, China",
            "category": "City"
        },
        {
            "name": "Zurich, Switzerland",
            "category": "State"
        },
        {
            "name": "Zwickau, Germany",
            "category": "City"
        },
        {
            "name": "Zwolle, Netherlands",
            "category": "City"
        },
        {
            "name": "Zürich, Switzerland",
            "category": "City"
        },
        {
            "name": "İstanbul, Turkey",
            "category": "City"
        }
    ];
    locations = _.uniq(locations, 'name');
    locations = locations.sort((a, b) => {
        if (a.name.length < b.name.length) {
            return -1;
        }
    });

    let industries = [
        {
            "id":"5567cd4773696439b10b0000",
            "name":"information technology \u0026 services"
        },
        {
            "id":"5567cd4773696439dd350000",
            "name":"construction"
        },
        {
            "id":"5567cd467369644d39040000",
            "name":"marketing \u0026 advertising"
        },
        {
            "id":"5567cd477369645401010000",
            "name":"real estate"
        },
        {
            "id":"5567cddb7369644d250c0000",
            "name":"health, wellness \u0026 fitness"
        },
        {
            "id":"5567cdd47369643dbf260000",
            "name":"management consulting"
        },
        {
            "id":"5567cd4e7369643b70010000",
            "name":"computer software"
        },
        {
            "id":"5567cd4d736964397e020000",
            "name":"internet"
        },
        {
            "id":"5567ced173696450cb580000",
            "name":"retail"
        },
        {
            "id":"5567cdd67369643e64020000",
            "name":"financial services"
        },
        {
            "id":"5567d1127261697f2b1d0000",
            "name":"consumer services"
        },
        {
            "id":"5567cdde73696439812c0000",
            "name":"hospital \u0026 health care"
        },
        {
            "id":"5567cdf27369644cfd800000",
            "name":"automotive"
        },
        {
            "id":"5567e0e0736964198de70700",
            "name":"restaurants"
        },
        {
            "id":"5567ce9e736964540d540000",
            "name":"education management"
        },
        {
            "id":"5567ce1e7369643b806a0000",
            "name":"food \u0026 beverages"
        },
        {
            "id":"5567cdbc73696439d90b0000",
            "name":"design"
        },
        {
            "id":"5567ce9d7369643bc19c0000",
            "name":"hospitality"
        },
        {
            "id":"5567ce1f7369643b78570000",
            "name":"accounting"
        },
        {
            "id":"5567cd8e7369645409450000",
            "name":"events services"
        },
        {
            "id":"5567cd4773696454303a0000",
            "name":"nonprofit organization management"
        },
        {
            "id":"5567cdd37369643b80510000",
            "name":"entertainment"
        },
        {
            "id":"5567cd4c73696439c9030000",
            "name":"electrical/electronic manufacturing"
        },
        {
            "id":"5567cdd87369643bc12f0000",
            "name":"leisure, travel \u0026 tourism"
        },
        {
            "id":"5567cd49736964541d010000",
            "name":"professional training \u0026 coaching"
        },
        {
            "id":"5567cd4e7369644cf93b0000",
            "name":"transportation/trucking/railroad"
        },
        {
            "id":"5567ce1f7369644d391c0000",
            "name":"law practice"
        },
        {
            "id":"5567cd82736964540d0b0000",
            "name":"apparel \u0026 fashion"
        },
        {
            "id":"5567cdb77369645401080000",
            "name":"architecture \u0026 planning"
        },
        {
            "id":"5567ce2673696453d95c0000",
            "name":"mechanical or industrial engineering"
        },
        {
            "id":"5567cdd973696453d93f0000",
            "name":"insurance"
        },
        {
            "id":"5567cd4c7369644d39080000",
            "name":"telecommunications"
        },
        {
            "id":"5567e0e37369640e5ac10c00",
            "name":"human resources"
        },
        {
            "id":"5567e09973696410db020800",
            "name":"staffing \u0026 recruiting"
        },
        {
            "id":"5567ce227369644eed290000",
            "name":"sports"
        },
        {
            "id":"5567ce2d7369644d25250000",
            "name":"legal services"
        },
        {
            "id":"5567cdd97369645624020000",
            "name":"oil \u0026 energy"
        },
        {
            "id":"5567e0ea7369640d2ba31600",
            "name":"media production"
        },
        {
            "id":"5567cd4973696439d53c0000",
            "name":"machinery"
        },
        {
            "id":"5567d01e73696457ee100000",
            "name":"wholesale"
        },
        {
            "id":"5567ce987369643b789e0000",
            "name":"consumer goods"
        },
        {
            "id":"5567cd4f736964540d050000",
            "name":"music"
        },
        {
            "id":"5567cd4f7369644cfd250000",
            "name":"photography"
        },
        {
            "id":"5567d0467369645dbc200000",
            "name":"medical practice"
        },
        {
            "id":"5567e1ae73696423dc040000",
            "name":"cosmetics"
        },
        {
            "id":"5567ce5b736964540d280000",
            "name":"environmental services"
        },
        {
            "id":"5567cd4d73696439d9040000",
            "name":"graphic design"
        },
        {
            "id":"5567e0fa73696410e4c51200",
            "name":"business supplies \u0026 equipment"
        },
        {
            "id":"5567cd49736964540d020000",
            "name":"renewables \u0026 environment"
        },
        {
            "id":"5567ce9c7369643bc9980000",
            "name":"facilities services"
        },
        {
            "id":"5567ce5b73696439a17a0000",
            "name":"publishing"
        },
        {
            "id":"5567e1b3736964208b280000",
            "name":"food production"
        },
        {
            "id":"5567cd4d73696439d9030000",
            "name":"arts \u0026 crafts"
        },
        {
            "id":"5567e1a17369641ea9d30100",
            "name":"building materials"
        },
        {
            "id":"5567e13a73696418756e0200",
            "name":"civil engineering"
        },
        {
            "id":"5567e0f27369640e5aed0c00",
            "name":"religious institutions"
        },
        {
            "id":"5567ce5973696453d9780000",
            "name":"public relations \u0026 communications"
        },
        {
            "id":"5567cd4c73696453e1300000",
            "name":"higher education"
        },
        {
            "id":"5567cd4d7369644d513e0000",
            "name":"printing"
        },
        {
            "id":"5567cede73696440d0040000",
            "name":"furniture"
        },
        {
            "id":"5567e3f3736964395d7a0000",
            "name":"mining \u0026 metals"
        },
        {
            "id":"5567cd4973696439b9010000",
            "name":"logistics \u0026 supply chain"
        },
        {
            "id":"5567e09f736964160ebb0100",
            "name":"research"
        },
        {
            "id":"5567e0eb73696410e4bd1200",
            "name":"pharmaceuticals"
        },
        {
            "id":"5567d02b7369645d8b140000",
            "name":"individual \u0026 family services"
        },
        {
            "id":"5567e1b97369641ea9690200",
            "name":"medical devices"
        },
        {
            "id":"5567cdda7369644eed130000",
            "name":"civic \u0026 social organization"
        },
        {
            "id":"5567e19c7369641c48e70100",
            "name":"e-learning"
        },
        {
            "id":"5567e19b7369641ead740000",
            "name":"security \u0026 investigations"
        },
        {
            "id":"5567e21e73696426a1030000",
            "name":"chemicals"
        },
        {
            "id":"5567cd527369643981050000",
            "name":"government administration"
        },
        {
            "id":"5567cdb373696439dd540000",
            "name":"online media"
        },
        {
            "id":"5567e0bc7369641d11550200",
            "name":"investment management"
        },
        {
            "id":"5567cd4f7369644d2d010000",
            "name":"farming"
        },
        {
            "id":"5567cdd973696439a1370000",
            "name":"writing \u0026 editing"
        },
        {
            "id":"5567e1327369641d91ce0300",
            "name":"textiles"
        },
        {
            "id":"5567ce2773696454308f0000",
            "name":"mental health care"
        },
        {
            "id":"5567cdd97369645430680000",
            "name":"primary/secondary education"
        },
        {
            "id":"5567e0f973696416d34e0200",
            "name":"broadcast media"
        },
        {
            "id":"5567d08e7369645dbc4b0000",
            "name":"biotechnology"
        },
        {
            "id":"5567e0c97369640d2b3b1600",
            "name":"information services"
        },
        {
            "id":"5567ce9c7369644eed680000",
            "name":"international trade \u0026 development"
        },
        {
            "id":"5567cdd7736964540d130000",
            "name":"motion pictures \u0026 film"
        },
        {
            "id":"5567e1947369641ead570000",
            "name":"consumer electronics"
        },
        {
            "id":"5567ce237369644ee5490000",
            "name":"banking"
        },
        {
            "id":"5567ce9d7369645430c50000",
            "name":"import \u0026 export"
        },
        {
            "id":"5567e1337369641ad2970000",
            "name":"industrial automation"
        },
        {
            "id":"5567e134736964214f5e0000",
            "name":"recreational facilities \u0026 services"
        },
        {
            "id":"5567e0af7369641ec7300000",
            "name":"performing arts"
        },
        {
            "id":"5567e2127369642420170000",
            "name":"utilities"
        },
        {
            "id":"5567e113736964198d5e0800",
            "name":"sporting goods"
        },
        {
            "id":"5567e2097369642420150000",
            "name":"fine art"
        },
        {
            "id":"5567e0bf7369641d115f0200",
            "name":"airlines/aviation"
        },
        {
            "id":"5567cd877369644cf94b0000",
            "name":"computer \u0026 network security"
        },
        {
            "id":"5567cd8273696439b1240000",
            "name":"maritime"
        },
        {
            "id":"5567cda97369644cfd3e0000",
            "name":"luxury goods \u0026 jewelry"
        },
        {
            "id":"5567ce9673696439d5c10000",
            "name":"veterinary"
        },
        {
            "id":"5567e1587369641c48370000",
            "name":"venture capital \u0026 private equity"
        },
        {
            "id":"5567cd4d7369643b78100000",
            "name":"wine \u0026 spirits"
        },
        {
            "id":"5567cdda7369644cf95d0000",
            "name":"plastics"
        },
        {
            "id":"5567e0dd73696416d3c20100",
            "name":"aviation \u0026 aerospace"
        },
        {
            "id":"5567e1887369641d68d40100",
            "name":"commercial real estate"
        },
        {
            "id":"5567cd8b736964540d0f0000",
            "name":"computer games"
        },
        {
            "id":"5567e36973696431a4480000",
            "name":"packaging \u0026 containers"
        },
        {
            "id":"5567e09473696410dbf00700",
            "name":"executive office"
        },
        {
            "id":"5567e0d47369641233eb0600",
            "name":"computer hardware"
        },
        {
            "id":"5567cdbe7369643b78360000",
            "name":"computer networking"
        },
        {
            "id":"5567e1387369641ec75d0200",
            "name":"market research"
        },
        {
            "id":"5567d04173696457ee520000",
            "name":"outsourcing/offshoring"
        },
        {
            "id":"5567e2907369642433e60200",
            "name":"program development"
        },
        {
            "id":"5567e1097369641d91230300",
            "name":"translation \u0026 localization"
        },
        {
            "id":"5567ce9673696453d99f0000",
            "name":"philanthropy"
        },
        {
            "id":"5567cd4a7369643ba9010000",
            "name":"public safety"
        },
        {
            "id":"5567e27c7369642ade490000",
            "name":"alternative medicine"
        },
        {
            "id":"5567e15373696422aa0a0000",
            "name":"museums \u0026 institutions"
        },
        {
            "id":"5567e127736964181e700200",
            "name":"warehousing"
        },
        {
            "id":"5567e1097369641b5f810500",
            "name":"defense \u0026 space"
        },
        {
            "id":"5567cd4a73696439a9010000",
            "name":"newspapers"
        },
        {
            "id":"5567e97f7369641e57730100",
            "name":"paper \u0026 forest products"
        },
        {
            "id":"5567e0e073696408da441e00",
            "name":"law enforcement"
        },
        {
            "id":"5567e1ab7369641f6d660100",
            "name":"investment banking"
        },
        {
            "id":"5567e29b736964256c370100",
            "name":"government relations"
        },
        {
            "id":"5567d2ad7261697f2b1f0100",
            "name":"fund-raising"
        },
        {
            "id":"5567e1de7369642069ea0100",
            "name":"think tanks"
        },
        {
            "id":"5567cd4f736964397e030000",
            "name":"glass, ceramics \u0026 concrete"
        },
        {
            "id":"5567cdb773696439a9080000",
            "name":"capital markets"
        },
        {
            "id":"5567e0d87369640e5aa30c00",
            "name":"semiconductors"
        },
        {
            "id":"5567e36f73696431a4970000",
            "name":"animation"
        },
        {
            "id":"5567e25f736964256cff0000",
            "name":"political organization"
        },
        {
            "id":"5567e8bb7369641a658f0000",
            "name":"package/freight delivery"
        },
        {
            "id":"5567e3ca736964371b130000",
            "name":"wireless"
        },
        {
            "id":"5567e3657369642f4ec90000",
            "name":"international affairs"
        },
        {
            "id":"5567e28a7369642ae2500000",
            "name":"public policy"
        },
        {
            "id":"556808697369647bfd420000",
            "name":"libraries"
        },
        {
            "id":"5567e0cf7369641233e50600",
            "name":"gambling \u0026 casinos"
        },
        {
            "id":"5567e14673696416d38c0300",
            "name":"railroad manufacture"
        },
        {
            "id":"5567fd5a73696442b0f20000",
            "name":"ranching"
        },
        {
            "id":"5567e2c572616932bb3b0000",
            "name":"military"
        },
        {
            "id":"5567f96c7369642a22080000",
            "name":"fishery"
        },
        {
            "id":"5567e2a97369642a553d0000",
            "name":"supermarkets"
        },
        {
            "id":"5567e8a27369646ddb0b0000",
            "name":"dairy"
        },
        {
            "id":"55680085736964551e070000",
            "name":"tobacco"
        },
        {
            "id":"5568047d7369646d406c0000",
            "name":"shipbuilding"
        },
        {
            "id":"55680a8273696407b61f0000",
            "name":"judiciary"
        },
        {
            "id":"5567e1a87369641f6d550100",
            "name":"alternative dispute resolution"
        },
        {
            "id":"5567e7be736964110e210000",
            "name":"nanotechnology"
        },
        {
            "id":"55718f947369642142b84a12",
            "name":"agriculture"
        },
        {
            "id":"5567e1797369641c48c10100",
            "name":"legislative office"
        }
    ];
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
            width: '400',
            type: 'string',
        },
        {
            field: 'state',
            headerName: 'State',
            type: 'string',
        },
        {
            field: 'actions',
            headerName: 'Actions',
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
                        className="btn btn-primary btn-sm"
                    >
                        <FontAwesomeIcon icon={faRemove} />
                    </Button>
                </strong>
            ),
        },
    ];

    const rows = [
        { id: 1, hydratorName: 'North American Prospects', state: 'Testing', lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, hydratorName: 'Safety Managers', state: 'Testing', lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, hydratorName: 'Experiment', state: 'Testing', lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    ];


    const handleChange = (event, newState) => {
        if (newState !== null) {
            setProfileState(newState);
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
                                <div data-v-029f7e9f="" className="tab-content">
                                    <div data-v-029f7e9f="" id="prospect" role="tabpanel" aria-labelledby="prospect-tab" className="tab-pane fade show active" style={{padding: "0px"}}>
                                        <div style={{padding: "15px"}}>


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
                                                        onChange={handleChange}
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
                                                                <input type="text" style={{ fontSize: "0.875rem", lineHeight: "1.25rem"}} className="form-control sm:text-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 border-gray-300 disabled:opacity-50 text-gray-800" aria-label="Amount (to the nearest dollar)" />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text">.00</span>
                                                                </div>
                                                            </div>
                                                            <span className="input-group-addon col-md-2 center"> <FontAwesomeIcon icon={faArrowsH} style={{position:"relative", top: "5px"}}/> </span>
                                                            <div className="input-group col-md-5">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">$</span>
                                                                </div>
                                                                <input type="text" style={{ fontSize: "0.875rem", lineHeight: "1.25rem"}} className="form-control sm:text-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 border-gray-300 disabled:opacity-50 text-gray-800" aria-label="Amount (to the nearest dollar)" />
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
                                                        <input data-v-7d86ee8a="" type="text" data-lpignore="true" autoComplete="msgsndr1" placeholder="Tag Added to Prospect" className="hl-text-input shadow-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 block w-full sm:text-sm border-gray-300 rounded disabled:opacity-50 text-gray-800" name="msgsndr1" maxLength="" />

                                                    </div>

                                                </div>
                                            </div>

                                        </div>

                                        <button data-v-029f7e9f="" type="button" className="btn btn-primary float-right">Test Now</button>
                                    </div>

                                </div>

                            </div>


                        </div>
                    </div>
                    <div data-v-029f7e9f="" className="col-lg-6">
                        <div data-v-029f7e9f="" className="card">
                            <div data-v-029f7e9f="" className="card-header">
                                <h2 data-v-029f7e9f="">Stored Profiles</h2>
                                <button data-v-029f7e9f="" type="button" className="btn btn-primary btn-sm">+</button>
                            </div>
                            <div data-v-029f7e9f="" className="card-body">
                                <div data-v-8f0d508e="" data-v-029f7e9f="" className="tab-content">
                                    <div data-v-8f0d508e="" id="note" role="tabpanel" aria-labelledby="note-tab" className="tab-pane fade show active">
                                        <div data-v-8f0d508e="" className="form-group">
                                            <div data-v-89f68d3c="" data-v-8f0d508e="" className="">
                                                <DataGrid
                                                    rows={rows}
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
