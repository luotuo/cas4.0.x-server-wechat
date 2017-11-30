package org.jasig.cas.support.pac4j.plugin.weixin;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.extractors.AccessTokenExtractor;
import org.scribe.extractors.JsonTokenExtractor;
import org.scribe.model.OAuthConfig;
import org.scribe.model.Verb;
import org.scribe.utils.OAuthEncoder;

/**
 * Created by luotuo on 17-9-19.
 */
public class WeiXinApi20 extends DefaultApi20 {

    //private static final String WEIXIN_AUTHORIZE_URL = "https://open.weixin.qq.com/connect/qrconnect?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_login#wechat_redirect";

    private String url = "https://open.weixin.qq.com/connect/qrconnect?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_login&state=WeiXinClient#wechat_redirect";
    public WeiXinApi20() {
        super();
    }
    public WeiXinApi20(String authorizeUrl) {
        this.url = authorizeUrl;
    }
    @Override
    public AccessTokenExtractor getAccessTokenExtractor()
    {
        return new JsonTokenExtractor();
    }

    @Override
    public Verb getAccessTokenVerb()
    {
        return Verb.POST;
    }

    @Override
    public String getAccessTokenEndpoint() {
        return "https://api.weixin.qq.com/sns/oauth2/access_token";
    }

    @Override
    public String getAuthorizationUrl(OAuthConfig config) {
        return String.format(url, config.getApiKey(), OAuthEncoder.encode("http://conference.3audit.com/cas-server/login"));
    }
}
