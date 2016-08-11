package com.weview.model.dropbox;

import com.dropbox.core.*;
import com.dropbox.core.v1.DbxEntry;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.*;

import javax.servlet.http.HttpSession;
import java.text.MessageFormat;
import java.util.*;

import static com.sun.activation.registries.LogSupport.log;

public class DropboxManager {
    private static DropboxManager instance = null;
    private DbxAppInfo appInfo;
    private DbxRequestConfig reqConfig;
    private DbxWebAuth webAuth;
    private static Map<String, String> userAccessToken = new HashMap<>();
    private static Map<String, String> sessionPlayerID = new HashMap<>();

    private DropboxManager() {
        try {
            //URL uri = DropboxManager.class.getResource("/dropbox/db")
            //String path = uri.getPath();
            //this.appInfo = DbxAppInfo.Reader.readFromFile(path);
            this.appInfo = DbxAppInfo.Reader.readFromFile("D:/IntelliJ Projects/weview/src/main/java/com/weview/model/dropbox/db.txt");
        } catch (Exception e) {
            e.printStackTrace();
        }
        this.reqConfig = new DbxRequestConfig("weview");
        webAuth = new DbxWebAuth(reqConfig, appInfo);
    }

    public static DropboxManager getInstance() {

        if(instance == null){
            synchronized(DropboxManager.class){
                if(instance == null){
                    instance = new DropboxManager();
                }
            }
        }

        return instance;
    }

    public void saveAccessToken(String token, String playerID){
        if(token != null && !token.isEmpty() && playerID != null && !playerID.isEmpty())
        {
            this.userAccessToken.put(playerID, token);
        }
    }

    public String getAccessTokenByPlayerID(String playerID){
        //can return null..need to check after calling to the method
        return userAccessToken.get(playerID);
    }

    public String getToDropboxRedirectUri(HttpSession session, String sessionKey, String playerID){
        savePlayerIdWithSessionId(playerID, session.getId());
        DbxSessionStore csrfTokenStore = new DbxStandardSessionStore(session, sessionKey);
        DbxWebAuth.Request authRequest = DbxWebAuth.newRequestBuilder()
                .withRedirectUri(getRedirectUriFinish(), csrfTokenStore).build();

        return webAuth.authorize(authRequest);
    }

    public String getAccessToken(HttpSession session, String sessionKey, Map paramMap)
            throws DbxWebAuth.NotApprovedException, DbxWebAuth.BadRequestException, DbxException,
            DbxWebAuth.CsrfException, DbxWebAuth.BadStateException, DbxWebAuth.ProviderException {
        DbxSessionStore csrfTokenStore = new DbxStandardSessionStore(session, sessionKey);
        String redirectUri = getRedirectUriFinish();
        DbxAuthFinish authFinish = webAuth.finishFromRedirect(redirectUri, csrfTokenStore, paramMap);

        return authFinish.getAccessToken();
    }

    private String getRedirectUriFinish(){
        return "http://localhost:8080/dropbox-finish";
    }

    private void savePlayerIdWithSessionId(String playerID, String sessionID){
        sessionPlayerID.put(sessionID, playerID);
    }

    public String getPlayerIdBySessionID(String sessionID){
        return sessionPlayerID.get(sessionID);
    }


    public List<String> getListOfFilePaths(String playerID, String path) throws DbxException {
        DbxClientV2 client = getDbxClient(playerID);
        List<String> filePaths = new ArrayList<>();
//        TreeMap<String,Metadata> children = new TreeMap<String,Metadata>();

        ListFolderResult listFolderResult = client.files().listFolder(path);


        for (Metadata data: listFolderResult.getEntries()) {
            filePaths.add(data.getName());
        }
//            GetTemporaryLinkResult temporaryLink = client.files().getTemporaryLink(data.getPathLower());
//            String link = temporaryLink.getLink();
//            filePaths.add(link);

//        while(true) {
//            for (Metadata metadata : listFolderResult.getEntries()) {
//                if (metadata instanceof DeletedMetadata) {
//                    children.remove(metadata.getPathLower());
//                } else {
//                    children.put(metadata.getPathLower(), metadata);
//                }
//            }
//
//            if (!listFolderResult.getHasMore())
//                break;
//
//            listFolderResult = client.files().listFolderContinue(listFolderResult.getCursor());
//        }

//        for (Metadata metadata : children.values()) {
//            filePaths.add(metadata.getName());
//        }

        return filePaths;
    }

    private DbxClientV2 getDbxClient(String playerID){
        return new DbxClientV2(reqConfig, userAccessToken.get(playerID));
    }

}
