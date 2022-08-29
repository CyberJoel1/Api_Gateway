const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");
const fs = require("fs");

router.all("/servicio/*", (req, res) => {
    
    const myArray = (req.params)['0'].split("/");
    if (registry.services[myArray[0]]) {
    
    const { host, port, protocol } = registry.services[myArray[1]][0];
    let url = `${protocol}://${host}:${port}`;
    
    for (let index = 1; index < myArray.length; index++) {
      url=url+(`/${myArray[index]}`);
    }

    
    axios({
      method: req.method,
      url: url,
      headers: req.headers,
      data: req.body
    }).then(async(response) => {
      let result= await response;
     
      res.json(result.data);
    });
    }else{
      res.json({'mensaje':'no se pudo'})
    }
});
router.post("/unregister", (req, res) => {
    const registrationInfo = req.body;
    if (apiAlreadyExists(registrationInfo)) {
      const index = registry.services[registrationInfo.apiName].findIndex(
        (instance) => {
          return formUrl(registrationInfo) === formUrl(instance);
        }
      );
      registry.services[registrationInfo.apiName].splice(index, 1);
      fs.writeFile(
          "./routes/registry.json",
          JSON.stringify(registry),
          (error) => {
            if (error) {
              res.send(
                "Could not unregister " + registrationInfo.apiName + "\n" + error
              );
            } else {
              res.send("Successfully unregistered " + registrationInfo.apiName);
            }
          }
        );
    } else {
      res.send(
        "Configuration does not exists for " +
          registrationInfo.apiName +
          " at " +
          registrationInfo.host
      );
    }
  });
router.post("/register", (req, res) => {
  const registrationInfo = req.body;
  if (apiAlreadyExists(registrationInfo)) {
    res.send(
      "Configuration already exists for " +
        registrationInfo.apiName +
        " at " +
        registrationInfo.host
    );
  } else {
    registry.services[registrationInfo.apiName].push({ ...registrationInfo });

    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send(
            "Could not register " + registrationInfo.apiName + "\n" + error
          );
        } else {
          res.send("Successfully registered " + registrationInfo.apiName);
        }
      }
    );
  }
});



const apiAlreadyExists = (registrationInfo) => {
  let exists = false;
    if(!(registry.services[registrationInfo.apiName])){
        registry.services[registrationInfo.apiName]=[];
    }
  registry.services[registrationInfo.apiName]?.forEach((instance) => {
    if (formUrl(instance) === formUrl(registrationInfo)) {
      exists = true;
      return;
    }
  });

  return exists;
};

function formUrl(registro) {
  const { host, port, protocol, apiName } = registro;
  const url = `${protocol}://${host}:${port}/${apiName}`;
  return url;
}

module.exports = router;
