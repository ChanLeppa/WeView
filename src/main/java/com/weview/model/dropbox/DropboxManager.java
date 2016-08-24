package com.weview.model.dropbox;

import com.dropbox.core.*;
import com.dropbox.core.v1.DbxEntry;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.*;
import javax.servlet.http.HttpSession;
import java.text.MessageFormat;
import java.util.*;

public class DropboxManager {
    private static DropboxManager instance = null;
    private DbxAppInfo appInfo = new DbxAppInfo("rz82vb6w1c2dsgd", "7np3pwsphspipdv");
    private DbxRequestConfig reqConfig;
    private DbxWebAuth webAuth;
    private Map<String, String> userAccessToken = new HashMap<>();
    private Map<String, String> sessionPlayerID = new HashMap<>();

    private DropboxManager() {
//        try {
//            this.appInfo = DbxAppInfo.Reader.readFromFile("D:/IntelliJ Projects/weview/src/main/java/com/weview/model/dropbox/db.txt");
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
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


    public List<String> getListOfFileNames(String playerID, String path) throws DbxException {
        DbxClientV2 client = getDbxClient(playerID);
        List<String> fileNames = new ArrayList<>();
        DbxUserFilesRequests files = client.files();
        ListFolderResult listFolderResult = files.listFolder(path);

        while(true){
            for (Metadata data: listFolderResult.getEntries()) {
                fileNames.add(data.getName());
            }
            if (!listFolderResult.getHasMore()) {
                break;
            }
            listFolderResult = files.listFolderContinue(listFolderResult.getCursor());
        }

        return fileNames;
    }

//    private List<String> getListOfVideoNames(DbxUserFilesRequests files, List<String> fileNames) {
//        List<String> videoNames = new ArrayList<>();
//        for (String name : fileNames) {
//            try {
//                Metadata metadata = files.getMetadata(name);
//            } catch (DbxException e) {
//                e.printStackTrace();
//            }
//        }
//    }

    public String getSourceLinkToFile(String playerID, String fileName){
        DbxClientV2 client = getDbxClient(playerID);
        String link = "";

        try {
            DbxUserFilesRequests files = client.files();
            GetTemporaryLinkResult temporaryLink = files.getTemporaryLink("/" + fileName);
            link = temporaryLink.getLink();
        } catch (DbxException e) {
            e.printStackTrace();
        }

        return link;
    }

    public Boolean checkAccessToken(String playerID) {
        Boolean res = false;

        if(getAccessTokenByPlayerID(playerID) != null) {
            res = true;
        }

        return res;
    }

    private DbxClientV2 getDbxClient(String playerID){
        return new DbxClientV2(reqConfig, userAccessToken.get(playerID));
    }

}
