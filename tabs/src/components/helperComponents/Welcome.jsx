import { useContext, useState } from "react";
import { Dropdown, Input } from "@fluentui/react-northstar";
import { SearchIcon } from '@fluentui/react-icons-northstar'
import "./Welcome.css";
import { app } from "@microsoft/teams-js";
import { AzureFunctions } from "./AzureFunctions";
import { useData } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { LearningProvider } from "./Provider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faHouse, faSearch, faBook, faGlobe, faSpinner } from '@fortawesome/free-solid-svg-icons';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { toasterErrorMessage } from "../utils/errorHandlingUtils";
import * as XLSX from 'xlsx';
require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');

export function Welcome(props) {
  const { environment, triggerConsent, apiClient } = {
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const friendlyEnvironmentName =
    {
      local: "local environment",
      azure: "Azure environment",
    }[environment] || "local environment";

  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });
  const userName = (loading || error) ? "" : data.displayName;
  const hubName = useData(async () => {
    await app.initialize();
    const context = await app.getContext();
    return context.app.host.name;
  })?.data;

  const [allUsers, setAllUsers] = useState([]);
 

  // get all users names and id data
  useData(async () => {
    try {
      const response = await apiClient.get("allUsers");
      console.log("allusers", response)
      // Extracting the "display name" property from each object in the array
      const displayNames = response.data.data.map(user => ({
        id: user.id,
        displayname: user.displayName,
      }));
      
      console.log("allusers2", displayNames)
      // Set the extracted display names in your state or perform any other desired action
      setAllUsers(displayNames);

    
    } catch (error) {
      let errorMessage = error.response.data.error;
      if (errorMessage.includes("invalid_grant")) {
        triggerConsent(true);
      } else {
        toasterErrorMessage(errorMessage);
      }
    }
  });

  //all users data 
  const [allUsersdata, setAllUsersdata] = useState([]);
  useData(async () => {
    try {
      const response = await apiClient.get("allUsers");
      console.log("allusers", response)
      // Extracting the "display name" property from each object in the array
      setAllUsersdata(response.data.data.value);

    
    } catch (error) {
      let errorMessage = error.response.data.error;
      if (errorMessage.includes("invalid_grant")) {
        triggerConsent(true);
      } else {
        toasterErrorMessage(errorMessage);
      }
    }
  });

  const formattedOptions = allUsers.map(user => ({
    key: user.id,
    header: user.displayname,
    content: user.displayname,
  }));
  
  //get learning data
  const [vivadata, setVivadata] = useState([])
  
  useData(async () => {
    let response = await apiClient.get("learningdata");
    setVivadata(response.data.value);
    console.log('vivadata', response);

  });

  //Export to Excel
  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  };

  //change content
  const [showDefault, setShowDefault] = useState(true);
   const handleClick = () => {
    setShowDefault(false);
  };


  //Searchquery


  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (event) => {
    const query = event.target.value;
    const filtered =  vivadata.filter((vival) =>
    vival.displayName.toLowerCase().includes(query.toLowerCase())
    );
    setSearchQuery(query);
    setFilteredData(filtered);
  };
  return (
    <>
       
       <div className="welcome page" style={{overflowX:"hidden",backgroundColor:"white"}} >
       <div className="">
         <div className="row" style={{ height: "100%", marginTop: "56px", backgroundColor:"white"}}>
           <div className="col-md-2">
             <div className="sidenav">
               <ul>
                 <li style={{ fontWeight: "600" }}>
                   <a onClick={handleClick}>
                     <FontAwesomeIcon icon={faHouse} style={{ margin: "0 10px 0 0" }} />
 
                     Course Activities
                   </a>
                 </li>
                 <li style={{ fontWeight: "600",cursor:"pointer" }}>
                   <a onClick={handleClick}>
                     <FontAwesomeIcon icon={faGlobe} style={{ margin: "0 10px 0 0" }} />
                     Learning Provider
                   </a>
                 </li>
                 <li style={{ fontWeight: "600" }}>
                   <a href="#">
                     <FontAwesomeIcon icon={faBook} style={{ margin: "0 10px 0 0" }} />
 
                     Learning Content
                   </a>
                 </li>
               </ul>
             </div>
           </div>
           <div className="col-md-10 mainBody" style={{ height: "100%" }}>
             <nav className="nav">
 
               <ul>
               
                 <li><a href="#">Welcome{userName ? ", " + userName : ""}</a></li>
                 <li>
                   {/* <div className="input-group rounded">
                     <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                     <span className="input-group-text border-0" id="search-addon">
                       <FontAwesomeIcon icon={faSearch} />
                     </span>
                   </div> */}
                    <Input placeholder="Search..."
                icon={<SearchIcon />}
                value={searchQuery}
                onChange={handleSearch}
                iconPosition="start"
              />
                 </li>
               </ul>
             </nav>

           

             <div className="row m-3 pt-2"> 
             { showDefault === true ?   (<><div className="col-md-8">
                  <button type="button" className="btn btn-success">Export to Excel</button>
                </div><div className="col-md-4">
                    <Dropdown
                      search
                      items={formattedOptions}
                      placeholder="Start typing a name"
                      noResultsMessage="We couldn't find any matches."
                      getA11ySelectionMessage={{
                        onAdd: (item) => `${item.header} has been selected.`,
                        onRemove: (item) => `${item.header} has been removed.`,
                      }} />

                  </div>
             <div>

             
                 
             <div className=" m-2 " >
               <div className="col-md-12">
                 <table className="table mt-3">
                   <thead>
                     <tr>
                       <th scope="col">#</th>
                       <th scope="col">Learning Content</th>
                       <th scope="col">Status</th>
                       <th scope="col">Completed Date</th>
                       <th scope="col">Completed Percentage</th>
                       <th scope="col">Due Date</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <th scope="row">1</th>
                       <td>Viva learning</td>
                       <td>Not Started</td>
                       <td>null</td>
                       <td>0</td>
                       <td>2023-12-16</td>
 
                     </tr>
                 </tbody>
                 </table>
 
               </div>
             </div>
             </div></>)  :  (  <div className="row">
             {filteredData.length > 0 ? filteredData.map((vival) => (
              <div className="card col-md-6" key={vival.id}>
              <div className="card-body">
    
                <h6 className="card-subtitle mb-2 text-muted">{vival.displayName}</h6>
              
                <img src={vival.longLogoWebUrlForLightTheme}></img>
               
    
              </div>
            </div>
              )): vivadata?.map((vival) => (
              <div className="card col-md-6" key={vival.id}>
              <div className="card-body">
    
                <h6 className="card-subtitle mb-2 text-muted">{vival.displayName}</h6>
              
                <img src={vival.longLogoWebUrlForLightTheme}></img>
               
    
              </div>
            </div>
              ))}
           </div>) }
           
           </div>
 
 
          
         </div>
       </div>
     </div>
    </div>
     
    
   </>
  );
}
