package com.weview.model.dropbox;

import com.dropbox.core.*;
import com.dropbox.core.v1.DbxEntry;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.*;
import com.weview.persistence.UserRepository;
import com.weview.persistence.entities.User;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpSession;
import java.text.MessageFormat;
import java.util.*;

public class DropboxManager {

    private DbxAppInfo appInfo = new DbxAppInfo("rz82vb6w1c2dsgd", "7np3pwsphspipdv");
    private DbxRequestConfig reqConfig;
    private DbxWebAuth webAuth;
//    private final String ridirectUriFinish = "http://localhost:8080/dropbox-finish";

    public DropboxManager() {
//        try {
//            this.appInfo = DbxAppInfo.Reader.readFromFile("D:/IntelliJ Projects/weview/src/main/java/com/weview/model/dropbox/db.txt");
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
        this.reqConfig = new DbxRequestConfig("weview");
        webAuth = new DbxWebAuth(reqConfig, appInfo);
    }

    public String getDropboxNoRedirectUri(){
        DbxWebAuth.Request webAuthRequest = DbxWebAuth.newRequestBuilder().withNoRedirect().build();
        return webAuth.authorize(webAuthRequest);
    }

    public String getAccessToken(String authCode) throws DbxException {
        DbxAuthFinish authFinish = null;
            authFinish = webAuth.finishFromCode(authCode);

        return authFinish.getAccessToken();
    }

//    public String getToDropboxRedirectUri(HttpSession session, String sessionKey){
//        DbxSessionStore csrfTokenStore = new DbxStandardSessionStore(session, sessionKey);
//        DbxWebAuth.Request authRequest = DbxWebAuth.newRequestBuilder()
//                .withRedirectUri(ridirectUriFinish, csrfTokenStore).build();
//
//        return webAuth.authorize(authRequest);
//    }
//
//    public String getAccessToken(HttpSession session, String sessionKey, Map paramMap)
//            throws DbxWebAuth.NotApprovedException, DbxWebAuth.BadRequestException, DbxException,
//            DbxWebAuth.CsrfException, DbxWebAuth.BadStateException, DbxWebAuth.ProviderException {
//
//        DbxSessionStore csrfTokenStore = new DbxStandardSessionStore(session, sessionKey);
//        DbxAuthFinish authFinish = webAuth.finishFromRedirect(ridirectUriFinish, csrfTokenStore, paramMap);
//
//        return authFinish.getAccessToken();
//    }

    public List<String> getListOfFileNames(String path, String token) throws DbxException {
        DbxClientV2 client = new DbxClientV2(reqConfig, token);
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

    public String getSourceLinkToFile(String fileName, String token){
        DbxClientV2 client = new DbxClientV2(reqConfig, token);
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
}
