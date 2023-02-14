import { Platform } from "react-native";

export const convertToPostMessageString = (obj) => JSON.stringify(obj);

export const getJavascriptSource = ({ option, additionalCode } = {}) => {
    const { OS } = Platform;

    return `
            var chart = echarts.init(document.getElementById('main'));
        
            function sendData(data) {
                window.ReactNativeWebView.postMessage(JSON.stringify({"type":"DATA","payload": data}));
            }

            function sendCallbackData(uuid, data) {
                window.ReactNativeWebView.postMessage(JSON.stringify({"type":"CALLBACK", "uuid": uuid, "payload": data}));
            }

            window.onresize = function() {
                chart.resize();
            };

            function getOS() {
                return ${OS};
            }
    
            function toString (obj) {
                var result = JSON.stringify(obj, function (key, val) {
                  if (typeof val === 'function') {
                    return val.toString();
                  }
                  return val;
                });
    
                return result;
            };
    
    
            function processMessage (e) {
              var req = JSON.parse(e.data);
    
              switch(req.type) {
                case "SET_OPTION":
                  chart.setOption(req.payload.option, req.payload.notMerge,req.payload.lazyUpate);
                  break;

                case "GET_OPTION":
                  var option = chart.getOption();
                  var data = {};
                  if(req.properties !== undefined) {
                      req.properties.forEach(function (prop) {
                        data[prop] = option[prop];
                      });
                  } else {
                      var data = {
                          option: option
                       };
                  }
  
                  sendCallbackData(req.uuid, data);
                  break;

                case "CLEAR":
                    chart.clear();
                    break;

                default:
                  break;
              }
            }
    
            window.document.addEventListener('message', function(e) {
              processMessage(e);
            });

            ${additionalCode}

            setTimeout(() => {
                chart.setOption(${JSON.stringify(option)});
            }, 1);
            
            true;
        `;
};
