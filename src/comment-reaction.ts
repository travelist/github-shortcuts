/**
 * Comment Reaction
 *
 * This class represents the reaction items of comment posts
 */
export class CommentReaction {

    public static readonly THUMB_UP = new CommentReaction("+1")
    public static readonly THUMB_DOWN = new CommentReaction("-1")
    // TODO Add other items

    private readonly dataReactionLabel: string

    private constructor(label: string) {
        this.dataReactionLabel = label
    }

    public label(): string {
        return this.dataReactionLabel
    }
}
