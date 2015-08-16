import java.io.IOException;
import java.io.StringWriter;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import java.util.*;

@ServerEndpoint("/echo") 
public class EchoServer {  
    static Map onlineSessions = new Hashtable();
    
    @OnOpen
    public void onOpen(Session session){
        JSONObject clientUserObj = new JSONObject();
        clientUserObj.put("session", session);
        onlineSessions.put(session.getId(),clientUserObj);        
        System.out.println("Open: Session " +session+" has started");
    }
    
    @OnMessage
    public void onMessage(String jsonString, Session session) throws Exception {        
        System.out.println("Server onMessage function");
        JSONParser parser = new JSONParser();
        Object obj=parser.parse(jsonString);        
        JSONObject jsonObj = (JSONObject)obj;
        if(((String)jsonObj.get("type")).equals("userJoin")){
            userJoin((String)jsonObj.get("data"),session);
        }else{
            twoPlayerData(jsonObj);
            //twoPlayerData((String)jsonObj.get("sendTo"),(String)jsonObj.get("sendFrom"),(JSONObject)jsonObj.get("data"),session);
        }
    } 
    @OnClose
    public void onClose(Session session){
        System.out.println("Close: Session " +session+" has ended");
        onlineSessions.remove(session.getId());
    }
    
    
    public void userJoin(String name, Session session) throws IOException{
        JSONObject userObj = (JSONObject)onlineSessions.get(session.getId());
        userObj.put("status","online");
        userObj.put("name",name);
        //loop to create a strigified JSON object of all users 
        JSONObject onlineUsersListForSending = new JSONObject();
        for (Iterator<JSONObject> iter = onlineSessions.values().iterator(); iter.hasNext();){          
            JSONObject user=(JSONObject)iter.next();
            JSONObject userDetails = new JSONObject();
            userDetails.put("status", user.get("status")); 
            userDetails.put("name", user.get("name"));   
            
            onlineUsersListForSending.put(user.get("name"),userDetails);
            onlineUsersListForSending.put("type", "onlineList");
                        
            
        }
        //loop to send the list of all users to all users
        StringWriter jsonString = new StringWriter();
        onlineUsersListForSending.writeJSONString(jsonString);
        String onlineUsersText = jsonString.toString();
        
        for (Iterator<JSONObject> iter = onlineSessions.values().iterator(); iter.hasNext();){          
            JSONObject user=(JSONObject)iter.next();
                        
            System.out.println("name: "+user.get("name"));                        
            
            Session userSession = (Session)user.get("session");
            System.out.println(userSession);            
                        
            userSession.getBasicRemote().sendText(onlineUsersText);
        }
    }
    public void twoPlayerData(JSONObject dataObj) throws IOException{
    
        StringWriter jsonString = new StringWriter();
        dataObj.writeJSONString(jsonString);
        String sendPackageText = jsonString.toString();
        
        for (Iterator<JSONObject> iter = onlineSessions.values().iterator(); iter.hasNext();){          
            JSONObject user=(JSONObject)iter.next();
            
            if(user.get("name").equals((String)dataObj.get("sendTo"))){   
                Session userSession = (Session)user.get("session");
                userSession.getBasicRemote().sendText(sendPackageText);
            }
        }
    }
   
}  
