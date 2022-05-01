import { stripIndents } from "common-tags";
import {
    CommandInteraction,
    Message,
    MessageEmbed,
    TextChannel,
    User,
    VoiceChannel,
} from "discord.js";
import { Manager, Player, Track, TrackUtils, UnresolvedTrack } from "erela.js";
import prettyMilliseconds from "pretty-ms";
import { Bot } from "../client";

export class MusicClient {
    private sentMessage: Message;

    private leaveMsg = true;

    public bot: Bot;

    public erela: Manager;

    public guildId: string;

    public voiceChannelId: string;

    public textChannelId: string;

    public player: Player;

    public currentlyPlaying: Track;

    constructor(
        bot: Bot,
        erela: Manager,
        guildId: string,
        voiceChannelId: string,
        textChannelId: string
    ) {
        this.bot = bot;
        this.erela = erela;
        this.guildId = guildId;
        this.voiceChannelId = voiceChannelId;
        this.textChannelId = textChannelId;

        this.player = this.erela.create({
            guild: this.guildId,
            selfDeafen: true,
            selfMute: false,
            textChannel: this.textChannelId,
            voiceChannel: this.voiceChannelId,
        });

        // Declare listeners
        this.erela.on("trackStart", async (player, track) => {
            const textChannel = <TextChannel>(
                this.bot.channels.cache.get(player.options.textChannel)
            );

            const user = <User>track.requester;

            const embed = new MessageEmbed()
                .setAuthor({
                    name: "🎶 Now Playing:",
                    iconURL: this.bot.user.displayAvatarURL(),
                })
                .setColor(this.bot.colors.DARK_ELECTRIC_BLUE)
                .setThumbnail(track.displayThumbnail("3"))
                .setDescription(
                    stripIndents`[${track.title}](${
                        track.uri
                    }) | \`${prettyMilliseconds(track.duration, {
                        colonNotation: true,
                        secondsDecimalDigits: 0,
                    })}\`
                    Requested By: ${user}`
                )
                .setFooter({
                    text: `${this.bot.user.username} | MahoMuri © 2022`,
                    iconURL: this.bot.user.displayAvatarURL(),
                });

            if (this.sentMessage) {
                await this.sentMessage.delete();
            }

            this.sentMessage = await textChannel.send({ embeds: [embed] });
        });

        this.erela.on("queueEnd", (player) => {
            const textChannel = <TextChannel>(
                this.bot.channels.cache.get(player.options.textChannel)
            );

            this.currentlyPlaying = null;

            const embed = new MessageEmbed()
                .setColor(bot.colors.GREEN_MUNSEL)
                .setDescription("**✅ Queue is now empty!**");
            textChannel.send({ embeds: [embed] });
        });

        this.erela.on("socketClosed", (player, payload) => {
            bot.consola.log(payload);
            if (payload.code === 4014 && payload.byRemote) {
                const textChannel = <TextChannel>(
                    this.bot.channels.cache.get(player.options.textChannel)
                );

                const voiceChannel = <VoiceChannel>(
                    this.bot.channels.cache.get(player.options.voiceChannel)
                );

                player.stop();

                if (!this.leaveMsg) {
                    const embed = new MessageEmbed()
                        .setColor(bot.colors.GREEN_MUNSEL)
                        .setDescription(`**✅ Left ${voiceChannel}**`);
                    textChannel.send({ embeds: [embed] });
                    this.leaveMsg = !this.leaveMsg;
                }
            }
        });
    }

    async search(searchTerm: string, requester: User) {
        const searchResult = await this.erela.search(
            {
                query: searchTerm,
            },
            requester
        );
        return searchResult;
    }

    async play(
        interaction: CommandInteraction,
        tracks: Array<Track | UnresolvedTrack>
    ) {
        this.player.queue.add(tracks);
        if (!this.currentlyPlaying) {
            this.join(interaction, this.voiceChannelId);
            await this.player.play();
            this.currentlyPlaying = TrackUtils.isUnresolvedTrack(
                this.player.queue.current
            )
                ? await TrackUtils.getClosestTrack(
                      this.player.queue.current as UnresolvedTrack
                  )
                : <Track>this.player.queue.current;
        }
    }

    join(interaction: CommandInteraction, voiceChannelId: string) {
        if (!this.player.voiceChannel) {
            this.voiceChannelId = voiceChannelId;
            this.player.setVoiceChannel(voiceChannelId);
        }
        const voiceChannel = <VoiceChannel>(
            this.bot.channels.cache.get(this.player.options.voiceChannel)
        );

        this.player.connect();

        if (this.leaveMsg) {
            const embed = new MessageEmbed()
                .setColor(this.bot.colors.GREEN_MUNSEL)
                .setDescription(`✅ **Joined ${voiceChannel}**`);
            interaction.editReply({ embeds: [embed] });
            this.leaveMsg = !this.leaveMsg;
        }
    }

    leave() {
        if (this.player.voiceChannel) {
            this.player.disconnect();
        }
    }
}
