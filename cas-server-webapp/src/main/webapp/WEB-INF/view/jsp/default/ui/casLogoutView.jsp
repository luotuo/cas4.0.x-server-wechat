<%--

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
<jsp:directive.include file="includes/top.jsp" />
  <div id="msg" class="success">
    <h2>成功退出系统</h2>
    <p>你已经成功退出系统</p>
    <p>如果为了进一步清除痕迹，请清除浏览器缓存</p>
	
  </div>
     <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>

     <script>

        $(function(){

            window.location.href = "http://118.190.132.68:8080/view/home.html";

        });

    </script>
<jsp:directive.include file="includes/bottom.jsp" />