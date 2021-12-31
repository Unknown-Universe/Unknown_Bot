CREATE TABLE `guilds` (
    `id` BIGINT NOT NULL,
    `prefix` VARCHAR(5) NOT NULL DEFAULT '~',
    `send_welcome` BOOLEAN NOT NULL DEFAULT 0,
    `welcome_channel` BIGINT,
    `welcome_message` VARCHAR(2000) NOT NULL DEFAULT 'Welcome {user} to the server',
    `auto_role` BIGINT,
    `set_auto_role` BOOLEAN NOT NULL DEFAULT 0,
    `do_filter` BOOLEAN NOT NULL DEFAULT 0,
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