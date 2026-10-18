package com.realestate.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestate.backend.dto.LoginRequest;
import com.realestate.backend.dto.RegisterRequest;
import com.realestate.backend.entity.User;
import com.realestate.backend.property.entity.Property;
import com.realestate.backend.property.repository.PropertyRepository;
import com.realestate.backend.repository.UserRepository;
import com.realestate.backend.service.AuthService;
import com.realestate.backend.service.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private WebApplicationContext webApplicationContext;

	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private AuthService authService;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PropertyRepository propertyRepository;

	private final List<Long> cleanupUserIds = new ArrayList<>();
	private final List<Long> cleanupPropertyIds = new ArrayList<>();

	@BeforeEach
	void setUp() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
				.apply(springSecurity())
				.build();
	}

	@AfterEach
	void tearDown() {
		for (Long id : cleanupPropertyIds) {
			try {
				propertyRepository.deleteById(id);
			} catch (Exception ignored) {
			}
		}
		cleanupPropertyIds.clear();

		for (Long id : cleanupUserIds) {
			try {
				userRepository.deleteById(id);
			} catch (Exception ignored) {
			}
		}
		cleanupUserIds.clear();
	}

	@Test
	void contextLoads() {
	}

	@Test
	void testGoogleOAuthAuthorizationEndpoint() throws Exception {
		// Verify that GET /oauth2/authorization/google initiates the OAuth2 redirect to accounts.google.com
		mockMvc.perform(get("/oauth2/authorization/google"))
				.andExpect(status().is3xxRedirection())
				.andExpect(header().string("Location", org.hamcrest.Matchers.containsString("accounts.google.com")));
	}

	@Test
	void testAuthRegisterAndLoginFlow() throws Exception {
		String testEmail = "test_user_" + System.currentTimeMillis() + "@example.com";

		RegisterRequest regReq = new RegisterRequest();
		regReq.setName("Test User");
		regReq.setEmail(testEmail);
		regReq.setPassword("Password123!");
		regReq.setRole("BUYER");

		// 1. Test POST /api/auth/register
		String registerResponse = mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(regReq)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.email").value(testEmail))
				.andExpect(jsonPath("$.name").value("Test User"))
				.andExpect(jsonPath("$.role").value("BUYER"))
				.andReturn().getResponse().getContentAsString();

		Long userId = objectMapper.readTree(registerResponse).get("id").asLong();
		cleanupUserIds.add(userId);

		// 2. Test POST /api/auth/login
		LoginRequest loginReq = new LoginRequest();
		loginReq.setEmail(testEmail);
		loginReq.setPassword("Password123!");

		String loginResponse = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.message").value("Login successful"))
				.andReturn().getResponse().getContentAsString();

		String token = objectMapper.readTree(loginResponse).get("token").asText();
		assertNotNull(token);

		// 3. Test GET /api/users/profile with JWT (Authorized)
		mockMvc.perform(get("/api/users/profile")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value(testEmail))
				.andExpect(jsonPath("$.name").value("Test User"));

		// 4. Test GET /api/users/profile without JWT (Redirects to OAuth login or forbidden)
		mockMvc.perform(get("/api/users/profile"))
				.andExpect(status().is3xxRedirection());
	}

	@Test
	void testPropertiesEndpointsWithAuth() throws Exception {
		String token = jwtService.generateToken("property_tester@example.com", "BUYER");

		// 1. GET /api/properties (Get all)
		mockMvc.perform(get("/api/properties")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());

		// 2. POST /api/properties (Create property)
		Property property = new Property();
		property.setTitle("Luxury Test Villa");
		property.setAddress("123 Test Boulevard");
		property.setCity("Testville");
		property.setState("CA");
		property.setZipCode("90210");
		property.setPropertyType("RESIDENTIAL");
		property.setPrice(750000.0);

		String createResponse = mockMvc.perform(post("/api/properties")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(property)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.address").value("123 Test Boulevard"))
				.andReturn().getResponse().getContentAsString();

		Long propertyId = objectMapper.readTree(createResponse).get("id").asLong();
		cleanupPropertyIds.add(propertyId);

		// 3. GET /api/properties/{id}
		mockMvc.perform(get("/api/properties/" + propertyId)
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(propertyId))
				.andExpect(jsonPath("$.city").value("Testville"));

		// 4. GET /api/properties/search
		mockMvc.perform(get("/api/properties/search")
						.header("Authorization", "Bearer " + token)
						.param("city", "Testville"))
				.andExpect(status().isOk());
	}

	@Test
	void testAuditLogsAndNotificationsEndpoints() throws Exception {
		String token = jwtService.generateToken("audit_user@example.com", "BUYER");

		// GET /api/audit
		mockMvc.perform(get("/api/audit")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());

		// GET /api/notifications
		mockMvc.perform(get("/api/notifications")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
	}

	@Test
	void testAdminEndpointRoleProtection() throws Exception {
		String buyerToken = jwtService.generateToken("buyer@example.com", "BUYER");
		String adminToken = jwtService.generateToken("admin@example.com", "ADMINISTRATOR");

		// 1. Regular buyer forbidden on admin endpoint
		mockMvc.perform(get("/api/admin/users")
						.header("Authorization", "Bearer " + buyerToken))
				.andExpect(status().isForbidden());

		// 2. Administrator allowed on admin endpoint
		mockMvc.perform(get("/api/admin/users")
						.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk());
	}

	@Test
	void testGoogleOAuthSuccessHandlerDirect() throws Exception {
		// Test GoogleOAuth2SuccessHandler with an OidcUser mock
		com.realestate.backend.config.GoogleOAuth2SuccessHandler handler =
				new com.realestate.backend.config.GoogleOAuth2SuccessHandler(jwtService, userRepository);

		org.springframework.security.oauth2.core.oidc.user.OidcUser oidcUser =
				org.mockito.Mockito.mock(org.springframework.security.oauth2.core.oidc.user.OidcUser.class);
		org.mockito.Mockito.when(oidcUser.getEmail()).thenReturn("google_test_" + System.currentTimeMillis() + "@gmail.com");
		org.mockito.Mockito.when(oidcUser.getFullName()).thenReturn("Google User");
		org.mockito.Mockito.when(oidcUser.getEmailVerified()).thenReturn(true);

		org.springframework.security.core.Authentication auth =
				new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(oidcUser, null);

		org.springframework.mock.web.MockHttpServletRequest request = new org.springframework.mock.web.MockHttpServletRequest();
		org.springframework.mock.web.MockHttpServletResponse response = new org.springframework.mock.web.MockHttpServletResponse();

		handler.onAuthenticationSuccess(request, response, auth);

		// Assert redirection to configured frontend URL with JWT token parameter
		assertEquals(302, response.getStatus());
		String redirectUrl = response.getRedirectedUrl();
		assertNotNull(redirectUrl);
		assertTrue(redirectUrl.contains("/login/success?token="));

		// Assert that user was persisted in database
		User createdUser = userRepository.findByEmail(oidcUser.getEmail()).orElse(null);
		assertNotNull(createdUser);
		assertEquals("Google User", createdUser.getName());
		assertEquals("BUYER", createdUser.getRole());

		cleanupUserIds.add(createdUser.getId());
	}
}
