CREATE TABLE `guilds` (
    `id` BIGINT NOT NULL,
    `prefix` VARCHAR(5) NOT NULL DEFAULT '~',
    `send_welcome` BOOLEAN NOT NULL DEFAULT 0,
    `welcome_channel` BIGINT,
    `welcome_message` VARCHAR(2000) NOT NULL DEFAULT 'Welcome, {user} to the server.',
    `auto_role` BIGINT,
    `do_filter` BOOLEAN NOT NULL DEFAULT 0,
    `show_user_count` BOOLEAN NOT NULL DEFAULT 0,
    `show_bot_count`  BOOLEAN NOT NULL DEFAULT 0,
    `show_total_count`  BOOLEAN NOT NULL DEFAULT 0,
    `user_count_channel_id` BIGINT,
    `bot_count_channel_id` BIGINT,
    `total_count_channel_id` BIGINT,
    `user_count` BIGINT NOT NULL DEFAULT 0,
    `bot_count` BIGINT NOT NULL DEFAULT 0,
    `total_count` BIGINT NOT NULL DEFAULT 0,
    `do_message_logging` BOOLEAN NOT NULL DEFAULT 0,
    `message_logging_channel` BIGINT,
    `do_moderation_logging` BOOLEAN NOT NULL DEFAULT 0,
    `do_counting` BOOLEAN NOT NULL DEFAULT 0,
    `counting_channel` BIGINT,
    `counting_number` INT NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`)
);

CREATE TABLE `filtered_words` (
    `guild_id` BIGINT NOT NULL,
    `word` VARCHAR(64) NOT NULL,
    FOREIGN KEY (`guild_id`) REFERENCES `guilds` (`id`) ON DELETE CASCADE
);

CREATE TABLE `users` (
    `id` BIGINT NOT NULL,
    `balance` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
);

CREATE TABLE `reaction_roles` (
    `message_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    `emoji_id` VARCHAR(19) NOT NULL
);