import { generateUID, error } from "./utils";

const $serverNameInput = document.getElementById(
  "serverName"
)! as HTMLInputElement;
const $partyNameInput = document.getElementById(
  "partyName"
)! as HTMLInputElement;
const $tablesSelect = document.getElementById(
  "tablesSelect"
)! as HTMLSelectElement;
const $serversSelect = document.getElementById(
  "serversSelect"
)! as HTMLSelectElement;
const $createServersBtn = document.getElementById("createServer")!;
const $seatPartyBtn = document.getElementById("seatParty")!;
const $servers = document.getElementById("servers")!;
const $tables = document.getElementById("tables")!;

interface ITable {
  id: string;
  seatCount: number;
  serverName?: string;
  partyName?: string;
}

const defaultTables: ITable[] = [
  {
    id: generateUID(),
    seatCount: 2
  },
  {
    id: generateUID(),
    seatCount: 2
  },
  {
    id: generateUID(),
    seatCount: 4
  },
  {
    id: generateUID(),
    seatCount: 4
  }
];

// Restaurant Hostess Problems
// 1. How many servers do we have today?
// 2. How many tables are there?
// 3. How many tables are available for seating?
// 4. What table/server is best for a party of 1?
// 5. What table/server is best for a party of 2?
// 6. What table/server is best for a party of 4?

// Objects/types: Restaurant, Server, Table, Party
// Actions:
// - add party to table
// - get list of available tables
// - get best next server/table

// UI NEEDED
// tables (server, party, empty)
// input & button to add server
// input & button to add party to table and server

// TYPES

// DEFAULTS

// STORAGE
function saveInStorage(name: string, value: any) {
  window.localStorage.setItem(name, JSON.stringify(value));
}
function getFromStorage(name: string) {
  const item = window.localStorage.getItem(name);
  if (item) {
    return JSON.parse(item);
  } else {
    return null;
  }
}

// UPDATE VIEW
function showServers() {
  // get servers from localstorage
  const servers = getFromStorage("servers") as string[];
  // show on view
  if (servers && servers?.length) {
    $servers.innerHTML = ``;
    servers.forEach((server) => {
      $servers.append(server + " ");
    });
  }
}

function showTables() {
  // get tables
  const tables = getFromStorage("tables") as ITable[];
  // if we have tables...
  if (tables && tables?.length) {
    // show tables on view
    $tables.innerHTML = JSON.stringify(tables);
  }
}

function loadTableSelect() {
  $tablesSelect.innerHTML = '<option value="">Select Table</option>';
  // get tables
  const tables = getFromStorage("tables") as ITable[];
  // if we have tables...
  if (tables && tables?.length) {
    // show tables in select box
    tables.forEach((table) => {
      const tableElement = document.createElement("option");
      tableElement.value = table.id;
      tableElement.innerHTML = table.seatCount.toString();
      $tablesSelect.append(tableElement);
    });
  }
}

function loadServerSelect() {
  $serversSelect.innerHTML = '<option value="">Select Server</option>';
  // get servers
  const servers = getFromStorage("servers") as string[];
  // if have servers...
  if (servers && servers?.length) {
    servers.forEach((server) => {
      const serverElement = document.createElement("option");
      serverElement.value = server;
      serverElement.innerHTML = server;
      $serversSelect.append(serverElement);
    });
  }
  // show servers in select box
}

// ACTIONS
function addServer(event: MouseEvent) {
  // ignore page refresh
  event.preventDefault();
  // get value form serverName input
  const serverName = $serverNameInput.value;
  // check if input is not empty
  if (serverName === "") {
    throw new Error("Dude! That server name is weak.");
  }
  const servers = getFromStorage("servers") as string[];
  // save in server list
  // store servers in localStorage
  const newServers = servers?.length ? [...servers, serverName] : [serverName];
  saveInStorage("servers", newServers);
  // clear input field
  $serverNameInput.value = "";
  // show the servers
  showServers();
  loadServerSelect();
}

// EVENT HANDLERS
$createServersBtn.addEventListener("click", (event) => addServer(event));

// SETUP
// store tables if not exist
const tables = getFromStorage("tables");
if (!tables || tables.length === 0) {
  saveInStorage("tables", defaultTables);
}

showServers();
showTables();
loadTableSelect();
loadServerSelect();
