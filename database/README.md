# TulasiAI Labs - Database Architecture

## Overview

This directory contains the complete database schema and deployment documentation for TulasiAI Labs, a production-ready SaaS platform built with Supabase PostgreSQL.

## Architecture

### Database Design Principles
- **UUID Primary Keys**: All tables use UUID for better scalability
- **Row Level Security**: Complete data isolation per user
- **Audit Trails**: Automatic timestamp tracking for all operations
- **Performance Optimized**: Strategic indexes for common queries
- **Data Integrity**: Comprehensive constraints and validations

### Core Tables

#### 1. `profiles`
User profile information linked to Supabase Auth
- **Relations**: 1:1 with `auth.users`
- **Key Fields**: experience_level, job_readiness_score, daily_learning_hours
- **Constraints**: Unique user_id, email validation

#### 2. `skills`
User skill tracking with proficiency levels
- **Relations**: Many-to-1 with `profiles`
- **Key Fields**: skill_name, level, proficiency_level, hours_practiced
- **Constraints**: Unique skill per user, proficiency range validation

#### 3. `tasks`
Daily task management system
- **Relations**: Many-to-1 with `profiles`
- **Key Fields**: title, task_type, completed, due_date, priority
- **Constraints**: Title length, hour range validation

#### 4. `streaks`
Learning streak tracking
- **Relations**: 1:1 with `profiles`
- **Key Fields**: current_streak, longest_streak, last_active_date
- **Constraints**: Non-negative values, unique user_id

#### 5. `notifications`
User notification system
- **Relations**: Many-to-1 with `profiles`
- **Key Fields**: title, message, notification_type, is_read
- **Constraints**: Message length, type validation

#### 6. `certifications`
Professional certification tracking
- **Relations**: Many-to-1 with `profiles`
- **Key Fields**: title, issuer, verification_status, issue_date
- **Constraints**: Date validation, verification status

#### 7. `career_predictions`
AI-powered career analysis results
- **Relations**: Many-to-1 with `profiles`
- **Key Fields**: suggested_roles, salary_range, confidence_score
- **Constraints**: Confidence score range

#### 8. `user_activity_logs`
Comprehensive audit trail
- **Relations**: Many-to-1 with `profiles`
- **Key Fields**: activity_type, activity_data, ip_address
- **Constraints**: Activity type validation

## File Structure

```
database/
|
|-- README.md                    # This file
|-- supabase-schema.sql         # Complete schema (for direct execution)
|-- DEPLOYMENT_GUIDE.md         # Step-by-step deployment instructions
|-- migrations/
|   |-- 001_initial_schema.sql   # Migration file
|
|-- ../frontend/src/types/
|   |-- database.ts             # TypeScript definitions
```

## Key Features

### Security
- **Row Level Security (RLS)**: Users can only access their own data
- **Foreign Key Constraints**: Prevent orphaned records
- **Check Constraints**: Data validation at database level
- **Audit Logging**: Complete activity tracking

### Performance
- **Strategic Indexes**: Optimized for common query patterns
- **Materialized Views**: Pre-computed dashboard statistics
- **Query Optimization**: Efficient JOIN operations
- **Connection Pooling**: Ready for high traffic

### Scalability
- **UUID Primary Keys**: Distributed-friendly identifiers
- **JSONB Fields**: Flexible data storage for complex objects
- **Partitioning Ready**: Tables designed for future partitioning
- **Migration System**: Version-controlled schema changes

## Data Flow

### User Registration Flow
```
auth.users (Supabase) 
    -> profiles (auto-create)
    -> streaks (auto-create)
    -> user_activity_logs (track)
```

### Daily Activity Flow
```
User Action 
    -> Activity Log 
    -> Streak Update 
    -> Notification (if applicable)
```

### Career Prediction Flow
```
User Skills + Profile 
    -> AI Algorithm 
    -> career_predictions 
    -> notifications (insights)
```

## Constraints and Validation

### Data Integrity
- **Email Format**: Validated at application level
- **Date Ranges**: Issue date before expiry date
- **Numeric Ranges**: Hours, scores, proficiency levels
- **String Lengths**: Minimum and maximum character limits
- **Enum Values**: Restricted to predefined options

### Business Logic
- **Streak Calculation**: Automatic consecutive day tracking
- **Job Readiness Score**: Weighted calculation from multiple factors
- **Skill Proficiency**: 1-10 scale with validation
- **Task Completion**: Timestamp tracking for completion

## Index Strategy

### Primary Indexes
- All foreign keys indexed for JOIN performance
- UUID primary keys for efficient lookups
- User_id indexes for user-specific queries

### Secondary Indexes
- **Composite Indexes**: Multi-column queries (user_id, skill_name)
- **Time-based Indexes**: created_at, due_date, last_active_date
- **Category Indexes**: skill categories, task types, notification types
- **Status Indexes**: completed, is_read, verification_status

### Query Patterns Optimized
- Dashboard statistics aggregation
- User skill progression tracking
- Task completion analytics
- Notification filtering and sorting
- Streak calculation queries

## Migration System

### Version Control
- Migration files with semantic versioning
- Rollback capabilities included
- Dependency tracking between migrations
- Automatic logging of migration history

### Migration Files
- `001_initial_schema.sql`: Base schema setup
- Future migrations: Additions, modifications, optimizations
- Rollback scripts: Safe schema reversion

## Monitoring and Maintenance

### Performance Monitoring
- Slow query logging enabled
- Index usage statistics
- Connection pool monitoring
- Storage usage tracking

### Backup Strategy
- Automated daily backups
- Point-in-time recovery
- Cross-region replication (optional)
- Export capabilities for compliance

### Security Monitoring
- Failed login attempts tracking
- Data access pattern analysis
- RLS policy effectiveness
- Anomaly detection setup

## Development Workflow

### Local Development
1. Set up Supabase local development
2. Apply migration files
3. Test RLS policies
4. Validate constraints

### Testing Strategy
- Unit tests for database functions
- Integration tests for API endpoints
- Performance tests for queries
- Security tests for RLS policies

### Deployment Process
1. Review migration files
2. Test in staging environment
3. Backup production database
4. Apply migrations
5. Verify functionality
6. Monitor performance

## Best Practices

### Schema Design
- Use UUID for distributed systems
- Implement proper constraints
- Design for query patterns
- Plan for future growth

### Security
- Enable RLS on all user data
- Use parameterized queries
- Implement audit logging
- Regular security reviews

### Performance
- Index strategically
- Avoid N+1 queries
- Use materialized views
- Monitor query performance

### Maintenance
- Regular backup testing
- Index usage analysis
- Storage planning
- Performance tuning

## Troubleshooting

### Common Issues
1. **Permission Denied**: Check RLS policies
2. **UUID Generation**: Verify extension enabled
3. **Foreign Key Violations**: Ensure parent records exist
4. **Performance Issues**: Review query plans and indexes

### Debug Tools
- Supabase Query Editor
- PostgreSQL EXPLAIN ANALYZE
- Application logs
- Database metrics dashboard

## Future Enhancements

### Planned Features
- Database partitioning for large datasets
- Advanced analytics with time-series data
- Real-time subscriptions for live updates
- Machine learning model integration

### Scalability Plans
- Read replicas for analytics
- Connection pooling optimization
- Caching layer implementation
- Geographic distribution

---

## Quick Reference

### Essential Commands
```sql
-- Check table structure
\d profiles

-- View RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Test user access
SELECT * FROM profiles WHERE user_id = auth.uid();

-- Check indexes
\d+ profiles
```

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Connection String
```
postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

---

This database architecture provides a solid foundation for the TulasiAI Labs SaaS platform, ensuring security, performance, and scalability for production use.
