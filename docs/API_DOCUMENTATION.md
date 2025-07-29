# Biowell AI API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URLs & Environments](#base-urls--environments)
4. [Request/Response Format](#requestresponse-format)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [User Profile Endpoints](#user-profile-endpoints)
   - [Health Metrics Endpoints](#health-metrics-endpoints)
   - [Nutrition Endpoints](#nutrition-endpoints)
   - [Fitness Endpoints](#fitness-endpoints)
   - [AI Coach Endpoints](#ai-coach-endpoints)
   - [Recipe Endpoints](#recipe-endpoints)
   - [Supplement Endpoints](#supplement-endpoints)
8. [Webhooks](#webhooks)
9. [Real-time Features](#real-time-features)
10. [SDK & Tools](#sdk--tools)
11. [Testing](#testing)
12. [Deployment](#deployment)

---

## Overview

The Biowell AI API is a RESTful API that powers the Biowell health coaching platform. It provides endpoints for managing user health data, AI-powered coaching, nutrition tracking, fitness monitoring, and personalized recommendations.

### Key Features

- **AI-Powered Health Coaching**: Natural language processing for personalized health advice
- **Comprehensive Health Tracking**: Nutrition, fitness, sleep, and biomarker monitoring
- **Real-time Updates**: WebSocket connections for live data synchronization
- **Wearable Integration**: Support for popular fitness trackers and health devices
- **Personalized Recommendations**: ML-driven supplement and lifestyle suggestions

### API Principles

- **RESTful Design**: Predictable resource-based URLs
- **JSON-First**: All requests and responses use JSON
- **Stateless**: Each request contains all necessary information
- **Versioned**: API versions to ensure backward compatibility
- **Secure**: JWT-based authentication with role-based access control

---

## Authentication

### Authentication Methods

#### 1. JWT Bearer Token (Recommended)

All API requests require authentication using JWT bearer tokens.

```http
Authorization: Bearer <jwt_token>
```

#### 2. API Key (for Server-to-Server)

For server-to-server communication, use API keys.

```http
X-API-Key: <api_key>
```

### Obtaining Tokens

#### Login with Email/Password

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": {...}
  }
}
```

#### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### OAuth2 Integration

```http
GET /auth/oauth/google
GET /auth/oauth/apple
GET /auth/oauth/facebook
```

### Token Security

- **Access tokens** expire in 1 hour
- **Refresh tokens** expire in 30 days
- Store tokens securely (never in localStorage for sensitive apps)
- Implement automatic token refresh

---

## Base URLs & Environments

### Production

```
https://api.biowell.ai/v1
```

### Staging

```
https://api-staging.biowell.ai/v1
```

### Development

```
https://api-dev.biowell.ai/v1
```

### Local Development

```
http://localhost:54321/functions/v1
```

---

## Request/Response Format

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
X-Client-Version: 1.0.0
X-Platform: web|ios|android
```

### Response Format

All responses follow a consistent structure:

#### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2025-07-29T10:00:00Z",
    "request_id": "req_123456789",
    "version": "1.0.0"
  }
}
```

#### Paginated Response

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  },
  "meta": {
    "timestamp": "2025-07-29T10:00:00Z",
    "request_id": "req_123456789"
  }
}
```

### Query Parameters

#### Pagination

```
?page=1&per_page=20&sort=created_at&order=desc
```

#### Filtering

```
?filter[status]=active&filter[date_from]=2025-01-01&filter[date_to]=2025-12-31
```

#### Field Selection

```
?fields=id,name,email&include=profile,preferences
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The provided data is invalid",
    "details": {
      "email": ["Email is required"],
      "password": ["Password must be at least 8 characters"]
    },
    "request_id": "req_123456789",
    "timestamp": "2025-07-29T10:00:00Z"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content to return |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Invalid or missing authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate email) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Invalid authentication credentials |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `AI_SERVICE_ERROR` | AI service temporarily unavailable |
| `INTEGRATION_ERROR` | Third-party service error |
| `DATA_SYNC_ERROR` | Wearable data sync failed |

---

## Rate Limiting

### Limits by Plan

| Plan | Requests/Hour | Requests/Day |
|------|---------------|--------------|
| Free | 100 | 1,000 |
| Pro | 1,000 | 10,000 |
| Enterprise | 10,000 | 100,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1643723400
X-RateLimit-Retry-After: 3600
```

### Rate Limit Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 3600 seconds.",
    "retry_after": 3600
  }
}
```

---

## API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /auth/register
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe",
  "terms_accepted": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "email_verified": false,
      "created_at": "2025-07-29T10:00:00Z"
    },
    "message": "Registration successful. Please check your email for verification."
  }
}
```

#### Verify Email

```http
POST /auth/verify-email
```

**Request:**

```json
{
  "token": "verification_token_here"
}
```

#### Reset Password

```http
POST /auth/reset-password
```

**Request:**

```json
{
  "email": "user@example.com"
}
```

#### Logout

```http
POST /auth/logout
```

**Request:**

```json
{
  "refresh_token": "refresh_token_here"
}
```

---

### User Profile Endpoints

#### Get User Profile

```http
GET /users/profile
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "height": 175,
    "weight": 70,
    "activity_level": "moderate",
    "health_goals": ["weight_loss", "muscle_gain"],
    "dietary_restrictions": ["gluten_free"],
    "allergies": ["nuts"],
    "preferences": {
      "units": "metric",
      "timezone": "UTC",
      "notifications": {
        "email": true,
        "push": true,
        "meal_reminders": true,
        "workout_reminders": true
      }
    },
    "created_at": "2025-07-29T10:00:00Z",
    "updated_at": "2025-07-29T10:00:00Z"
  }
}
```

#### Update User Profile

```http
PUT /users/profile
```

**Request:**

```json
{
  "name": "John Smith",
  "weight": 68,
  "health_goals": ["weight_loss", "better_sleep"],
  "preferences": {
    "notifications": {
      "meal_reminders": false
    }
  }
}
```

#### Upload Profile Picture

```http
POST /users/profile/avatar
Content-Type: multipart/form-data
```

**Request:**

```
avatar: <file>
```

---

### Health Metrics Endpoints

#### Log Health Metric

```http
POST /health-metrics
```

**Request:**

```json
{
  "type": "weight",
  "value": 68.5,
  "unit": "kg",
  "timestamp": "2025-07-29T08:00:00Z",
  "notes": "Morning weight after workout"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "metric_uuid",
    "type": "weight",
    "value": 68.5,
    "unit": "kg",
    "timestamp": "2025-07-29T08:00:00Z",
    "notes": "Morning weight after workout",
    "user_id": "user_uuid",
    "created_at": "2025-07-29T10:00:00Z"
  }
}
```

#### Get Health Metrics

```http
GET /health-metrics?type=weight&from=2025-07-01&to=2025-07-31
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "metric_uuid",
      "type": "weight",
      "value": 68.5,
      "unit": "kg",
      "timestamp": "2025-07-29T08:00:00Z",
      "trend": "decreasing",
      "notes": "Morning weight after workout"
    }
  ],
  "analytics": {
    "average": 69.2,
    "min": 67.8,
    "max": 70.1,
    "trend": "decreasing",
    "change_percent": -2.1
  }
}
```

#### Get Health Summary

```http
GET /health-metrics/summary?period=week
```

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "week",
    "health_score": 85,
    "metrics": {
      "weight": {
        "current": 68.5,
        "change": -0.5,
        "trend": "improving"
      },
      "sleep": {
        "average_hours": 7.2,
        "quality_score": 78,
        "trend": "stable"
      },
      "activity": {
        "daily_steps": 8542,
        "active_minutes": 45,
        "trend": "improving"
      }
    },
    "insights": [
      "Your weight is trending in the right direction",
      "Consider increasing sleep duration for better recovery"
    ]
  }
}
```

---

### Nutrition Endpoints

#### Search Foods

```http
GET /nutrition/foods/search?q=chicken%20breast&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "food_uuid",
      "name": "Chicken Breast, Grilled",
      "brand": "Generic",
      "serving_size": "100g",
      "nutrition": {
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "fiber": 0,
        "sugar": 0,
        "sodium": 74
      },
      "verified": true
    }
  ]
}
```

#### Log Meal

```http
POST /nutrition/meals
```

**Request:**

```json
{
  "meal_type": "breakfast",
  "foods": [
    {
      "food_id": "food_uuid",
      "quantity": 1,
      "serving_size": "100g"
    }
  ],
  "timestamp": "2025-07-29T08:00:00Z",
  "notes": "Post-workout breakfast"
}
```

#### Get Nutrition Log

```http
GET /nutrition/meals?date=2025-07-29
```

**Response:**

```json
{
  "success": true,
  "data": {
    "date": "2025-07-29",
    "meals": [
      {
        "id": "meal_uuid",
        "meal_type": "breakfast",
        "foods": [...],
        "nutrition_total": {
          "calories": 450,
          "protein": 35,
          "carbs": 25,
          "fat": 15
        },
        "timestamp": "2025-07-29T08:00:00Z"
      }
    ],
    "daily_total": {
      "calories": 1850,
      "protein": 125,
      "carbs": 180,
      "fat": 65
    },
    "goals": {
      "calories": 2000,
      "protein": 150,
      "carbs": 200,
      "fat": 67
    },
    "progress": {
      "calories": 92.5,
      "protein": 83.3,
      "carbs": 90.0,
      "fat": 97.0
    }
  }
}
```

---

### Fitness Endpoints

#### Log Workout

```http
POST /fitness/workouts
```

**Request:**

```json
{
  "name": "Upper Body Strength",
  "type": "strength_training",
  "duration": 45,
  "calories_burned": 320,
  "exercises": [
    {
      "name": "Bench Press",
      "sets": 3,
      "reps": 10,
      "weight": 80,
      "rest_time": 90
    }
  ],
  "timestamp": "2025-07-29T18:00:00Z",
  "notes": "Great session, felt strong"
}
```

#### Get Workout History

```http
GET /fitness/workouts?from=2025-07-01&to=2025-07-31
```

#### Generate Workout Plan

```http
POST /fitness/workout-plans/generate
```

**Request:**

```json
{
  "goals": ["muscle_gain", "strength"],
  "experience_level": "intermediate",
  "days_per_week": 4,
  "session_duration": 60,
  "equipment": ["dumbbells", "barbell", "cable_machine"],
  "target_muscles": ["chest", "back", "legs", "shoulders"]
}
```

---

### AI Coach Endpoints

#### Chat with AI Coach

```http
POST /ai/chat
```

**Request:**

```json
{
  "message": "I'm feeling tired lately. What could be causing this?",
  "context": {
    "recent_sleep": 6.2,
    "recent_activity": "low",
    "recent_nutrition": "below_targets"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "response": "Based on your recent data, there are several factors that could be contributing to your fatigue...",
    "recommendations": [
      {
        "type": "sleep",
        "title": "Improve Sleep Duration",
        "description": "Aim for 7-9 hours of sleep per night",
        "priority": "high"
      }
    ],
    "follow_up_questions": [
      "How has your stress level been lately?",
      "Are you getting enough protein in your diet?"
    ],
    "session_id": "session_uuid"
  }
}
```

#### Get AI Insights

```http
GET /ai/insights?period=week
```

**Response:**

```json
{
  "success": true,
  "data": {
    "health_score": 85,
    "insights": [
      {
        "type": "nutrition",
        "title": "Protein Intake Optimization",
        "description": "You're consistently hitting your protein targets. Great job!",
        "impact": "positive",
        "confidence": 0.92
      }
    ],
    "recommendations": [
      {
        "type": "sleep",
        "title": "Sleep Schedule Consistency",
        "description": "Try to maintain consistent bedtime and wake times",
        "priority": "medium",
        "estimated_benefit": "15% improvement in energy levels"
      }
    ]
  }
}
```

---

### Recipe Endpoints

#### Search Recipes

```http
GET /recipes/search?q=high%20protein&diet=vegetarian&max_time=30
```

#### Get Personalized Recipes

```http
GET /recipes/personalized?meal_type=dinner&servings=2
```

#### Save Recipe

```http
POST /recipes/saved
```

**Request:**

```json
{
  "recipe_id": "recipe_uuid",
  "notes": "Family favorite",
  "tags": ["quick", "healthy"]
}
```

---

### Supplement Endpoints

#### Get Recommendations

```http
GET /supplements/recommendations
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "supplement_uuid",
      "name": "Vitamin D3",
      "dosage": "2000 IU",
      "frequency": "daily",
      "reason": "Based on your location and limited sun exposure",
      "evidence_level": "strong",
      "potential_benefits": [
        "Bone health",
        "Immune function",
        "Mood support"
      ],
      "price_range": "$10-20/month",
      "confidence_score": 0.88
    }
  ]
}
```

---

## Webhooks

### Webhook Events

#### User Events

- `user.created`
- `user.updated`
- `user.deleted`

#### Health Data Events

- `health_metric.logged`
- `meal.logged`
- `workout.completed`

#### AI Events

- `ai_insight.generated`
- `recommendation.created`

### Webhook Configuration

```http
POST /webhooks
```

**Request:**

```json
{
  "url": "https://your-app.com/webhooks/biowell",
  "events": ["meal.logged", "workout.completed"],
  "secret": "webhook_secret_key"
}
```

### Webhook Payload Example

```json
{
  "event": "meal.logged",
  "data": {
    "user_id": "user_uuid",
    "meal": {
      "id": "meal_uuid",
      "meal_type": "breakfast",
      "calories": 450,
      "timestamp": "2025-07-29T08:00:00Z"
    }
  },
  "timestamp": "2025-07-29T08:05:00Z",
  "signature": "sha256=..."
}
```

---

## Real-time Features

### WebSocket Connection

```javascript
const ws = new WebSocket('wss://api.biowell.ai/v1/ws?token=jwt_token');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

### Subscriptions

```json
{
  "type": "subscribe",
  "channels": ["health_metrics", "ai_insights"]
}
```

### Real-time Events

- Health metric updates
- AI insight notifications
- Meal logging confirmations
- Workout progress updates

---

## SDK & Tools

### Official SDKs

#### JavaScript/TypeScript

```bash
npm install @biowell/api-client
```

```javascript
import { BiowellClient } from '@biowell/api-client';

const client = new BiowellClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

const profile = await client.users.getProfile();
```

#### Python

```bash
pip install biowell-api
```

```python
from biowell import BiowellClient

client = BiowellClient(api_key='your-api-key')
profile = client.users.get_profile()
```

#### React Hooks

```bash
npm install @biowell/react-hooks
```

```javascript
import { useHealthMetrics, useBiowellAuth } from '@biowell/react-hooks';

function Dashboard() {
  const { user } = useBiowellAuth();
  const { metrics, loading } = useHealthMetrics();
  
  return <div>...</div>;
}
```

### Development Tools

#### API Testing

- **Postman Collection**: Import our comprehensive Postman collection
- **Insomnia Workspace**: Pre-configured requests and environments
- **OpenAPI Spec**: Full OpenAPI 3.0 specification available

#### CLI Tool

```bash
npm install -g @biowell/cli

biowell auth login
biowell metrics log weight 68.5
biowell insights get
```

#### Debugging

- **Request ID Tracking**: Every request includes a unique request ID
- **Logging**: Comprehensive request/response logging
- **Error Monitoring**: Integration with Sentry for error tracking

---

## Testing

### Test Environments

#### Sandbox Environment

- **URL**: `https://api-sandbox.biowell.ai/v1`
- **Purpose**: Testing without affecting real data
- **Features**: Mock AI responses, simulated wearable data

#### Staging Environment

- **URL**: `https://api-staging.biowell.ai/v1`
- **Purpose**: Pre-production testing
- **Features**: Real AI, limited external integrations

### Test Data

#### Test Users

```json
{
  "email": "test@biowell.ai",
  "password": "test123456",
  "profile": "complete_profile_with_data"
}
```

#### Mock Data Generation

```http
POST /dev/generate-mock-data
```

**Request:**

```json
{
  "type": "health_metrics",
  "days": 30,
  "metrics": ["weight", "sleep", "steps"]
}
```

### Testing Best Practices

1. **Use Test Environment**: Always test against sandbox/staging
2. **Clean Up**: Remove test data after testing
3. **Rate Limiting**: Be aware of rate limits during testing
4. **Error Scenarios**: Test error conditions and edge cases
5. **Authentication**: Test token expiration and refresh flows

---

## Deployment

### Environment Configuration

#### Environment Variables

```bash
BIOWELL_API_URL=https://api.biowell.ai/v1
BIOWELL_API_KEY=your-api-key
BIOWELL_WEBHOOK_SECRET=your-webhook-secret
```

#### Configuration File

```json
{
  "api": {
    "baseUrl": "https://api.biowell.ai/v1",
    "timeout": 30000,
    "retries": 3
  },
  "features": {
    "realtime": true,
    "offline": true,
    "analytics": true
  }
}
```

### Health Checks

#### API Health

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-07-29T10:00:00Z",
  "services": {
    "database": "healthy",
    "ai": "healthy",
    "cache": "healthy"
  }
}
```

### Monitoring

#### Metrics to Track

- Request latency
- Error rates
- Authentication failures
- Rate limit hits
- AI service availability

#### Alerting

- API downtime
- High error rates
- Performance degradation
- Security events

---

## Support & Resources

### Documentation

- **API Reference**: Complete endpoint documentation
- **Guides**: Step-by-step implementation guides
- **Examples**: Code examples in multiple languages
- **Changelog**: API version changes and updates

### Community

- **Discord**: Join our developer community
- **Stack Overflow**: Tag questions with `biowell-api`
- **GitHub**: Report issues and contribute

### Support Channels

- **Email**: <api-support@biowell.ai>
- **Slack**: #api-support (for enterprise customers)
- **Response Time**: 24 hours (48 hours on weekends)

---

## Appendices

### A. HTTP Status Code Reference

### B. Error Code Reference  

### C. Webhook Event Reference

### D. Rate Limiting Details

### E. SDK Migration Guides

---

*Last Updated: July 29, 2025*
*API Version: 1.0.0*
