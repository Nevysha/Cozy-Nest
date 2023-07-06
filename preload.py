def preload(parser):
    # parser.add_argument(
    #     "--cozy-nest-session_secret_key",
    #     type=str,
    #     help="Secret key for session cookie",
    #     default=None,
    # )
    # parser.add_argument(
    #     "--cozy-auth",
    #     type=str,
    #     help="Comma-separated list of username:password pairs for basic auth",
    #     default=None,
    # )
    parser.add_argument(
        "--cozy-nest-debug",
        action="store_true",
        help="Enable debug logging",
    )
