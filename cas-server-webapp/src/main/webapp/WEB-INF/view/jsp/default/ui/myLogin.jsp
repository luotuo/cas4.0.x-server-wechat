﻿<%--

    Licensed to Jasig under one or more contributor license
    agreements. See the NOTICE file distributed with this work
    for additional information regarding copyright ownership.
    Jasig licenses this file to you under the Apache License,
    Version 2.0 (the "License"); you may not use this file
    except in compliance with the License.  You may obtain a
    copy of the License at the following location:

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.

--%>
<jsp:directive.include file="includes/top.jsp"/>


<div class="box" id="login">
    <form:form method="post" id="fm1" commandName="${commandName}" htmlEscape="true">

        <form:errors path="*" id="msg" cssClass="errors" element="div" htmlEscape="false"/>
        <div class="login_box">
            <h4 class="lb_title">系统登录1</h4>
            <form action="" id="loginForm">
                <div class="row">

                    <c:choose>
                        <c:when test="${not empty sessionScope.openIdLocalId}">
                            <strong>${sessionScope.openIdLocalId}</strong>
                            <div class="lb_co"><input class="lb_input" type="hidden" id="username" name="username"
                                                      value="${sessionScope.openIdLocalId}"/></div>
                        </c:when>
                        <c:otherwise>
                            <spring:message code="screen.welcome.label.netid.accesskey" var="userNameAccessKey"/>
                            <div class="lb_co"><form:input cssClass="required lb_input" cssErrorClass="error" id="username"
                                                           size="25" tabindex="1" accesskey="${userNameAccessKey}"
                                                           path="username" autocomplete="off" htmlEscape="true"
                                                           placeholder="请输入邮箱"/></div>
                        </c:otherwise>
                    </c:choose>
                </div>

                <div class="row">

                    <spring:message code="screen.welcome.label.password.accesskey" var="passwordAccessKey"/>
                    <div class="lb_co"><form:password cssClass="required lb_input" cssErrorClass="error" id="password"
                                                      size="25" tabindex="2" path="password"
                                                      accesskey="${passwordAccessKey}" htmlEscape="true" autocomplete="off"
                                                      placeholder="请输入密码"/></div>
                </div>


                <div class="">
                    <input type="hidden" name="lt" value="${loginTicket}"/>
                    <input type="hidden" name="execution" value="${flowExecutionKey}"/>
                    <input type="hidden" name="_eventId" value="submit"/>
                    <button id="submit" class="login_btn" name="submit" accesskey="l" tabindex="4" type="submit">登 陆
                    </button>
                    <a href="${WeiXinClientUrl}" class="login_btn_wechat">微信登录</a>
                </div>
            </form>
        </div>
        <div info="底部" class="indexFooter">

        </div>
    </form:form>
</div>
<jsp:directive.include file="includes/bottom.jsp"/>