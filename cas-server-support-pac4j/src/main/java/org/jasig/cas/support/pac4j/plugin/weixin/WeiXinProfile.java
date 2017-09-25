package org.jasig.cas.support.pac4j.plugin.weixin;

import org.pac4j.core.profile.AttributesDefinition;
import org.pac4j.oauth.profile.OAuth20Profile;
import org.pac4j.oauth.profile.OAuthAttributesDefinitions;

/**
 * Created by luotuo on 17-9-19.
 */
public class WeiXinProfile extends OAuth20Profile {

    private static final long serialVersionUID = -7969484323692570444L;

    public WeiXinProfile() {
    }

    protected AttributesDefinition getAttributesDefinition() {
        return WeiXinAttributesDefinition.weixinDefinition;
    }

    public String getOpenid() {
        return (String)this.getAttribute("openid");
    }

    public String getNickname() {
        return (String)this.getAttribute("nickname");
    }

    public Integer getSex() {
        return (Integer)this.getAttribute("sex");
    }

    public String getCountry() {
        return (String)this.getAttribute("country");
    }

    public String getProvince() {
        return (String)this.getAttribute("province");
    }

    public String getCity() {
        return (String)this.getAttribute("city");
    }

    public String getHeadimgurl() {
        return (String)this.getAttribute("headimgurl");
    }

    public String getUnionid() {
        return (String)this.getAttribute("unionid");
    }

}
