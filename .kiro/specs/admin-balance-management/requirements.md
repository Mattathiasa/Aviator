# Requirements Document

## Introduction

This feature enables an admin-controlled balance management system for the Aviator multiplayer game. Players will start with zero balance and must request funds from a designated admin user. The admin can approve or deny requests and grant custom amounts to players, providing full control over the game economy.

## Glossary

- **Game_Server**: The Node.js Socket.IO server that manages game state, player connections, and balance transactions
- **Player_Client**: The React-based web application used by regular players to play the game
- **Admin_Client**: A designated Player_Client with elevated privileges to manage player balances
- **Balance_Request**: A message sent from a Player_Client to the Admin_Client requesting funds
- **Balance_Grant**: An action performed by the Admin_Client to add funds to a Player_Client's balance
- **Admin_User**: A player designated with administrative privileges to manage balances
- **Regular_Player**: A player without administrative privileges who can request funds

## Requirements

### Requirement 1

**User Story:** As a new player, I want to start with zero balance and request funds from an admin, so that I can begin playing the game with admin approval

#### Acceptance Criteria

1. WHEN a Player_Client connects to the Game_Server, THE Game_Server SHALL initialize the player balance to zero
2. THE Player_Client SHALL display a button or interface element to request funds from the admin
3. WHEN a Regular_Player clicks the request funds button, THE Player_Client SHALL send a Balance_Request message to the Game_Server
4. WHEN the Game_Server receives a Balance_Request, THE Game_Server SHALL forward the request to all connected Admin_Clients with the player name and socket ID
5. THE Player_Client SHALL display a notification confirming the request was sent

### Requirement 2

**User Story:** As an admin, I want to see incoming balance requests from players, so that I can review and decide whether to grant them funds

#### Acceptance Criteria

1. THE Admin_Client SHALL display a dedicated panel or modal showing pending Balance_Requests
2. WHEN a Balance_Request is received, THE Admin_Client SHALL display the requesting player's name and current balance
3. THE Admin_Client SHALL provide an input field to specify the amount to grant
4. THE Admin_Client SHALL provide approve and deny buttons for each Balance_Request
5. THE Admin_Client SHALL display a list of all online players with their current balances

### Requirement 3

**User Story:** As an admin, I want to grant a custom amount of money to a player, so that I can control the game economy and provide appropriate starting funds

#### Acceptance Criteria

1. WHEN an Admin_User enters an amount and clicks approve, THE Admin_Client SHALL send a Balance_Grant message to the Game_Server with the player socket ID and amount
2. THE Game_Server SHALL validate that the amount is between 1 and 10000 birr
3. WHEN the Game_Server receives a valid Balance_Grant, THE Game_Server SHALL add the specified amount to the target player's balance
4. THE Game_Server SHALL send a balance update notification to the target Player_Client
5. THE Game_Server SHALL broadcast the updated player list to all connected clients

### Requirement 4

**User Story:** As an admin, I want to deny balance requests from players, so that I can reject inappropriate or duplicate requests

#### Acceptance Criteria

1. WHEN an Admin_User clicks deny on a Balance_Request, THE Admin_Client SHALL send a request denial message to the Game_Server
2. THE Game_Server SHALL send a notification to the requesting Player_Client indicating the request was denied
3. THE Admin_Client SHALL remove the denied request from the pending requests list
4. THE Player_Client SHALL display a message informing the player their request was denied

### Requirement 5

**User Story:** As a system administrator, I want to designate specific users as admins, so that only authorized users can grant funds

#### Acceptance Criteria

1. THE Game_Server SHALL maintain a list of admin socket IDs or authentication tokens
2. WHEN a Player_Client connects, THE Game_Server SHALL determine if the player is an Admin_User based on a configuration or authentication mechanism
3. THE Game_Server SHALL send admin status to the Player_Client upon connection
4. WHERE a player is an Admin_User, THE Player_Client SHALL display the admin balance management interface
5. THE Game_Server SHALL reject Balance_Grant messages from non-admin users

### Requirement 6

**User Story:** As a player, I want to see my balance update immediately after an admin grants me funds, so that I know I can start betting

#### Acceptance Criteria

1. WHEN the Game_Server updates a player balance, THE Game_Server SHALL emit a balance update event to the specific Player_Client
2. THE Player_Client SHALL update the displayed balance within 500 milliseconds of receiving the update
3. THE Player_Client SHALL display a toast notification showing the amount received
4. THE Player_Client SHALL enable betting controls if they were previously disabled due to zero balance

### Requirement 7

**User Story:** As an admin, I want to directly add funds to any player without waiting for a request, so that I can proactively manage player balances

#### Acceptance Criteria

1. THE Admin_Client SHALL display a list of all online players
2. WHERE a player is displayed in the admin panel, THE Admin_Client SHALL provide an "Add Funds" button next to each player
3. WHEN an Admin_User clicks "Add Funds", THE Admin_Client SHALL display an input field to enter the amount
4. WHEN an Admin_User submits the amount, THE Admin_Client SHALL send a Balance_Grant message to the Game_Server
5. THE Game_Server SHALL process the Balance_Grant following the same validation and update process as request-based grants
