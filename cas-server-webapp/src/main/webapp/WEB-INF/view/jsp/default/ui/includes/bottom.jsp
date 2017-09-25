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
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

      </div> <!-- END #content -->
      
     

    </div> <!-- END #container -->
	
    
    <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
	<script type="text/javascript" src="/cas-server/public/libs/json.js"></script>
	<script type="text/javascript" src="/cas-server/public/libs/base.js"></script>
	<script type="text/javascript" src="/cas-server/public/libs/layer.js"></script>
	<script type="text/javascript" src="/cas-server/public/libs/utils.js"></script>
	<script type="text/javascript" src="/cas-server/public/js/common1.js"></script>

    
    
    <spring:theme code="cas.javascript.file" var="casJavascriptFile" text="" />
    <script type="text/javascript" src="<c:url value="${casJavascriptFile}" />"></script>
  </body>
</html>

