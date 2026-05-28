# Lendsqr Frontend Assessment - Project Setup

## Project Overview

This is a React + TypeScript + SCSS admin dashboard application for the Lendsqr frontend assessment. The project includes:

- Login page with authentication
- Dashboard with statistics
- User management (list and details pages)
- Mock API with 500 users
- IndexedDB and localStorage for data persistence
- Comprehensive unit tests
- Fully responsive design

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: SCSS with variables and mixins
- **Routing**: React Router v7
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite
- **Storage**: IndexedDB + localStorage

## Project Structure

```
src/
├── __tests__/           # Unit tests
├── components/          # Reusable components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and Storage services
├── styles/             # SCSS files
├── types/              # TypeScript interfaces
├── utils/              # Utility functions
└── App.tsx             # Root component
```

## Development Commands

### Start Development Server
```bash
npm run dev
```
- Opens at http://localhost:5173/
- Hot module replacement enabled
- Live reloading on file changes

### Build for Production
```bash
npm run build
```
- TypeScript compilation
- Vite optimized build
- Output in `dist/` folder

### Run Tests
```bash
npm test              # Watch mode
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

## Login Credentials

### Demo Account
- **Email**: demo@lendsqr.com
- **Password**: password123

### Custom Login
Any valid email and password (min 6 characters) works with the demo setup.

## Features

### 1. Authentication
- Email and password validation
- Persistent login state (localStorage)
- Protected routes
- Logout functionality

### 2. Dashboard
- 6 key metric cards
- Real-time statistics from mock API
- Responsive grid layout

### 3. Users Page
- Display 500 mock users (paginated)
- Search by name, email, phone, or ID
- Filter by status (All, Active, Inactive, Pending, Blacklisted)
- Pagination with 10 users per page
- Mobile-friendly table view

### 4. User Details Page
- Comprehensive user information
- Editable status field
- Personal and financial information
- Employment and guarantor details
- Data persisted to IndexedDB/localStorage
- Back button to users list

## Responsive Design

- **Mobile First**: Starts at 320px
- **Breakpoints**:
  - Mobile: 320px - 575px
  - Tablet: 576px - 991px
  - Desktop: 992px+
- All components adapt to screen size
- Touch-friendly interface (44px+ buttons)

## Testing

The project includes tests for:
- **LoginPage**: Form validation, error handling
- **API Service**: Pagination, search, filtering, statistics
- **Storage Service**: IndexedDB/localStorage operations

### Running Tests
```bash
npm test              # Interactive watch mode
npm run test:ui       # Visual UI with results
npm run test:coverage # Coverage metrics
```

## Code Quality Standards

### TypeScript
- Full type safety with interfaces
- No `any` types (use generics instead)
- Strict null checks enabled

### Component Structure
- Functional components with hooks
- Single responsibility principle
- Reusable and composable components

### Styling
- SCSS with variables and mixins
- CSS Grid and Flexbox for layouts
- Mobile-first responsive approach
- Semantic color variables

### Comments
- JSDoc for functions and components
- Clear explanations for complex logic
- TODO comments for future improvements

### Testing
- Positive and negative test cases
- Coverage for critical paths
- Mocking external dependencies

## Build Optimization

- Code splitting via React Router
- Tree shaking of unused code
- Minification and compression
- Asset optimization

## Git Workflow

### Commit Message Format
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
test: Add/fix tests
refactor: Code refactoring
perf: Performance improvements
```

### Branch Naming
```
feature/feature-name
bugfix/bug-name
test/test-description
docs/doc-name
```

## Common Tasks

### Add New Page
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Create SCSS file in `src/styles/pages/`
4. Add tests in `src/__tests__/`

### Add New Component
1. Create in `src/components/`
2. Export from component file
3. Create SCSS in `src/styles/components/`
4. Add tests if shared/complex

### Add New Hook
1. Create in `src/hooks/`
2. Export and document usage
3. Add tests for hook logic

### Add New Utility
1. Create in `src/utils/`
2. Export functions
3. Add unit tests

## Database/Storage

### LocalStorage
- `lendsqr_auth_user`: Authentication state
- `lendsqr_user_details`: User details cache
- `lendsqr_mock_users`: Mock user data

### IndexedDB
- Database: `LendsqrDB`
- Store: `users`
- Used for: User details caching

## Error Handling

- Try-catch for async operations
- User-friendly error messages
- Fallback UI states
- Console logging for debugging

## Performance Metrics

Target metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 200KB (gzipped)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

Ready to deploy to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf dist
npm run build
```

## Next Steps

1. ✅ Review the README.md for complete documentation
2. ✅ Run `npm install` to install dependencies
3. ✅ Run `npm run dev` to start the development server
4. ✅ Open http://localhost:5173/ in your browser
5. ✅ Run `npm test` to verify tests pass
6. ✅ Review the code structure and components
7. ✅ Make a test commit to verify git setup

## Contact & Support

For questions about this assessment, refer to the project documentation or the original assessment brief.

---

**Assessment Status**: Ready for review

**Last Updated**: 2024

**Version**: 1.0.0
