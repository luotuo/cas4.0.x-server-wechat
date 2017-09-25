package org.jasig.cas.web.init;


import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by luotuo on 17-6-15.
 */
public class CORSFilter implements Filter{
    private boolean isCross = false;

    @Override
    public void destroy() {
        // TODO Auto-generated method stub
        isCross = false;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        // TODO Auto-generated method stub
        if(isCross){
            HttpServletRequest httpServletRequest = (HttpServletRequest)request;
            HttpServletResponse httpServletResponse = (HttpServletResponse)response;
            httpServletResponse.setHeader("Access-Control-Allow-Origin", "*");
            httpServletResponse.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
            httpServletResponse.setHeader("Access-Control-Max-Age", "0");
            httpServletResponse.setHeader("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With,userId,token");
            httpServletResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpServletResponse.setHeader("Access-Control-Expose-Headers", "Location");
            //httpServletResponse.setHeader("XDomainRequestAllowed","1");
        }
        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // TODO Auto-generated method stub
        String isCrossStr = filterConfig.getInitParameter("IsCross");
        isCross = isCrossStr.equals("true")?true:false;
    }
}
