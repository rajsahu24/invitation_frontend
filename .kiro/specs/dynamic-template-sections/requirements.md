# Requirements Document

## Introduction

This feature enables dynamic rendering of invitation form sections based on API-provided template configurations. The system must generate tabs and form fields dynamically from the `template_sections` object returned by the API, excluding the Photos tab which remains static. Additionally, the system must support real-time preview updates and proper data persistence.

## Glossary

- **Template_Section**: A collection of form fields grouped by a semantic key (e.g., "invitation_details", "family_details", "events")
- **Dynamic_Tab**: A tab in the UI that is generated based on the keys present in the `template_sections` object
- **Static_Tab**: A tab that is always present regardless of API response (e.g., "Photos")
- **Form_Field**: An individual input element defined by a TemplateField object with properties like key, type, label, order, required, and placeholder
- **Real_Time_Preview**: Live updating of the preview pane as the user types in form fields
- **Host_Dashboard**: The main interface where hosts edit invitation details
- **Metadata**: Custom field values stored as key-value pairs in the invitation's metadata object

## Requirements

### Requirement 1: Dynamic Tab Generation

**User Story:** As a host, I want to see tabs that match my invitation template's structure, so that I can edit all relevant sections for my event type.

#### Acceptance Criteria

1. WHEN the API returns `template_sections` with multiple section keys, THEN the system SHALL create a tab for each section key except "photos"
2. WHEN a section key is "invitation_details", THEN the system SHALL display it as the first tab with label "Details"
3. WHEN a section key is "family_details", THEN the system SHALL create a tab with label "Family Details"
4. WHEN a section key is "events", THEN the system SHALL create a tab with label "Events"
5. WHEN the API returns custom section keys not in the predefined list, THEN the system SHALL convert the key to a human-readable label by replacing underscores with spaces and capitalizing words
6. THE system SHALL always display the "Photos" tab as the last tab regardless of API response

### Requirement 2: Dynamic Form Field Rendering

**User Story:** As a host, I want form fields to be generated based on my template configuration, so that I only see relevant fields for my invitation type.

#### Acceptance Criteria

1. WHEN a template section contains an array of TemplateField objects, THEN the system SHALL render each field according to its type property
2. WHEN rendering fields within a section, THEN the system SHALL sort them by the order property in ascending order
3. WHEN a field has required set to true, THEN the system SHALL display a red asterisk next to the label and enforce validation
4. WHEN a field type is "text", THEN the system SHALL render a text input with appropriate icon
5. WHEN a field type is "date", THEN the system SHALL render a date picker input
6. WHEN a field type is "datetime-local", THEN the system SHALL render a datetime picker input
7. WHEN a field has a placeholder property, THEN the system SHALL display it as the input placeholder text

### Requirement 3: Real-Time Preview Updates

**User Story:** As a host, I want to see my changes reflected in the preview immediately, so that I can visualize my invitation as I edit it.

#### Acceptance Criteria

1. WHEN a user types in any form field, THEN the system SHALL trigger a preview update after 150ms of inactivity
2. WHEN the preview update is triggered, THEN the system SHALL send the current form data and metadata to the preview component
3. WHEN the preview component receives updated data, THEN the system SHALL refresh the iframe with the new data
4. WHEN multiple fields are changed rapidly, THEN the system SHALL debounce updates to prevent excessive re-renders
5. WHEN the user switches between tabs, THEN the system SHALL maintain the current preview state without resetting

### Requirement 4: Data Persistence

**User Story:** As a host, I want my changes to be saved to the server, so that my invitation data persists across sessions.

#### Acceptance Criteria

1. WHEN a user clicks the "Save Changes" button, THEN the system SHALL send a PATCH request to `/api/invitations/{invitationId}`
2. WHEN saving data, THEN the system SHALL include both basic fields (invitation_title, invitation_message, invitation_tag_line) and metadata in the request body
3. WHEN the save request succeeds, THEN the system SHALL mark the form as clean (not dirty) and display "Saved" status
4. WHEN the save request fails, THEN the system SHALL display an error message and keep the form in dirty state
5. WHEN form fields are modified after saving, THEN the system SHALL mark the form as dirty and enable the save button

### Requirement 5: Section-Specific Field Storage

**User Story:** As a host, I want my custom field values to be stored correctly, so that they are preserved and displayed in my invitation.

#### Acceptance Criteria

1. WHEN a user enters a value in a dynamic field, THEN the system SHALL store it in the metadata object using the field's key property
2. WHEN loading an invitation, THEN the system SHALL populate dynamic fields from the metadata object using their key properties
3. WHEN a field key exists in metadata, THEN the system SHALL display its value in the corresponding form field
4. WHEN a field key does not exist in metadata, THEN the system SHALL display an empty field or the default value if provided
5. WHEN saving, THEN the system SHALL preserve all metadata fields even if they are not currently visible in the form

### Requirement 6: Events Tab Functionality

**User Story:** As a host, I want the Events tab to display my sub-events, so that I can manage multiple events within my invitation.

#### Acceptance Criteria

1. WHEN the Events tab is selected, THEN the system SHALL display a list of all sub-events for the current invitation
2. WHEN no sub-events exist, THEN the system SHALL display a message "No sub-events created yet"
3. WHEN the user clicks "Add Event", THEN the system SHALL open the event creation form
4. WHEN an event is created or updated, THEN the system SHALL refresh the events list and trigger a preview update
5. WHEN an event is deleted, THEN the system SHALL remove it from the list and trigger a preview update

### Requirement 7: Tab State Management

**User Story:** As a host, I want the active tab to be preserved as I work, so that I don't lose my place when the component re-renders.

#### Acceptance Criteria

1. WHEN a user selects a tab, THEN the system SHALL update the activeTab state to the selected tab's ID
2. WHEN the component re-renders, THEN the system SHALL maintain the currently active tab
3. WHEN switching tabs, THEN the system SHALL display the content corresponding to the selected tab
4. WHEN the first tab is selected by default, THEN the system SHALL show the Details tab content
5. WHEN a tab has unsaved changes, THEN the system SHALL preserve those changes when switching to another tab and back
