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

// UI NEEDED
// tables (server, party, empty)
// input & button to add server
// input & button to add party to table and server

// TYPES
interface ITable {
  id: string;
  seatsCount: 2 | 4;
  serverId?: string;
  partyName?: string;
  // booth, bar, or, table
}

interface IServer {
  id: string;
  name: string;
}

// DEFAULTS
const defaultTables: ITable[] = [
  {
    id: generateUID(),
    seatsCount: 2
  },
  {
    id: generateUID(),
    seatsCount: 2
  },
  {
    id: generateUID(),
    seatsCount: 2
  },
  {
    id: generateUID(),
    seatsCount: 4
  },
  {
    id: generateUID(),
    seatsCount: 4
  }
];

// UPDATE VIEW
function displayServers(servers: IServer[]) {
  $servers.innerHTML = `<p>${JSON.stringify(
    servers.map((server) => server.name)
  )}</p>`;
}

function displayTables(tables: ITable[]) {
  if (!$tables) {
    throw new Error("No tables element found!");
  }
  $tables.innerHTML = `<p>${JSON.stringify(
    tables.map(
      (table) => `${table.seatsCount} ${table?.partyName ? "🍛" : "🍽"}`
    )
  )}</p>`;
}

function displayTableSelect(tables: ITable[]) {
  const availableTables = tables.filter((table) => !table?.partyName);
  $tablesSelect.innerHTML = `<option value="">Select Table</option>`;
  availableTables.forEach((table) => {
    const opt = document.createElement("option");
    opt.value = table.id.toString();
    opt.innerHTML = table.seatsCount.toString();
    $tablesSelect.appendChild(opt);
  });
}

function displayServerSelect(servers: IServer[]) {
  $serversSelect.innerHTML = `<option value="">Select Server</option>`;
  servers.forEach((server) => {
    const opt = document.createElement("option");
    opt.value = server.id;
    opt.innerHTML = server.name;
    $serversSelect.appendChild(opt);
  });
}

// STORAGE
function getSavedServers() {
  const servers = window.localStorage.getItem("servers");
  return servers ? JSON.parse(servers) : [];
}

function getSavedTables() {
  const tables = window.localStorage.getItem("tables");
  return tables ? JSON.parse(tables) : defaultTables;
}

// OBJECTS
class Restaurant {
  tables: ITable[];
  servers: IServer[];
  constructor() {
    this.tables = getSavedTables();
    this.servers = getSavedServers();

    displayServers(this.servers);
    displayTableSelect(this.tables);
    displayServerSelect(this.servers);
    displayTables(this.tables);
  }

  addServer = (e: MouseEvent) => {
    e.preventDefault();

    const name = $serverNameInput.value;

    if (name === "") {
      throw new Error("Server name is empty.");
    }

    const server: IServer = {
      id: generateUID(),
      name: name
    };

    const servers = [...this.servers, server];

    $serverNameInput.value = "";

    this.servers = servers;
    window.localStorage.setItem("servers", JSON.stringify(servers));
    displayServers(servers);
    displayServerSelect(servers);
    console.log("Created Server:", server, { servers });
  };

  seatParty = (e: MouseEvent) => {
    e.preventDefault();

    const partyName = $partyNameInput.value;
    const tableId = $tablesSelect.value;
    const serverId = $serversSelect.value;

    const newTables = this.tables.map((table) => {
      console.log("table", table.id === tableId, table.id, tableId);
      if (table.id === tableId) {
        return { ...table, partyName, serverId };
      } else {
        return table;
      }
    });

    $partyNameInput.value = "";
    $tablesSelect.value = "";
    $serversSelect.value = "";

    this.tables = newTables;
    window.localStorage.setItem("tables", JSON.stringify(newTables));
    displayTables(newTables);
    displayTableSelect(newTables);
    console.log("seat party", partyName, newTables);
  };
}

const store = new Restaurant();

// EVENT HANDLERS
$createServersBtn.addEventListener("click", (e) => store.addServer(e));
$seatPartyBtn.addEventListener("click", (e) => store.seatParty(e));
