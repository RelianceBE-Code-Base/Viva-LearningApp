import { useContext, useState } from "react";
import { useData } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { toasterErrorMessage } from "../utils/errorHandlingUtils";
require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');

export function LearningProvider(props) {
    const { environment, triggerConsent, apiClient } = {
        environment: window.location.hostname === "localhost" ? "local" : "azure",
        ...props,
      };
  //get learning data
  const [vivadata, setVivadata] = useState([])
  
  useData(async () => {
    let response = await apiClient.get("learningdata");
    setVivadata(response.data.value);
    console.log('vivadata', response);

  });

  return (
    <>
       
       <div className="welcome page" style={{ backgroundColor: "pink" }}>
       <div className="">
 
       <div className="row">
         {vivadata?.map((vival) => (
          <div className="card col-md-6" key={vival.id}>
          <div className="card-body">

            <h6 className="card-subtitle mb-2 text-muted">{vival.displayName}</h6>
          
            <a href="#" className="card-link">Another link</a>
           

          </div>
        </div>
          ))}
       </div>

         {/* <div className="row" style={{ height: "100%", marginTop: "56px" }}>
           <div className="col-md-2">
             <div class="sidenav">
               <ul>
                 <li style={{ fontWeight: "600" }}>
                   <a href="#">
                     <FontAwesomeIcon icon={faHouse} style={{ margin: "0 10px 0 0" }} />
 
                     Course Activities
                   </a>
                 </li>
                 <li style={{ fontWeight: "600" }}>
                   <a href="#">
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
                   <div className="input-group rounded">
                     <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                     <span className="input-group-text border-0" id="search-addon">
                       <FontAwesomeIcon icon={faSearch} />
                     </span>
                   </div>
                 </li>
 
               </ul>
             </nav>
            
             <div className="row m-2 pt-2">
               <div className="col-md-10">
                 <button type="button" className="btn btn-success">Export to Excel</button>
               </div>
               <div className="col-md-2">
                 <Dropdown
                   search
                   items= {formattedOptions
                   }
                   placeholder="Start typing a name"
                   noResultsMessage="We couldn't find any matches."
                   getA11ySelectionMessage={{
                     onAdd: (item) => `${item.header} has been selected.`,
                     onRemove: (item) => `${item.header} has been removed.`,
                   
                   }}
                 />
               
               </div>
             </div>
             {allUsersdata?.map((users) => (    
             <div className="row m-2 " key={users.id}>
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
                       <td>{users.displayNames}</td>
                       <td>Not Started</td>
                       <td>null</td>
                       <td>0</td>
                       <td>2023-12-16</td>
 
                     </tr>
                 </tbody>
                 </table>
 
               </div>
             </div>
             ))}
           </div>
 
 
          
         </div> */}
       </div>
     </div>
    
     
    
   </>
  );
}
