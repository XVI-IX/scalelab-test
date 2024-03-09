toc.dat                                                                                             0000600 0004000 0002000 00000062045 14572657706 0014471 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   
    :                |            scalelab    16.1    16.1 T    _           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         `           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         a           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         b           1262    17153    scalelab    DATABASE     }   CREATE DATABASE scalelab WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Nigeria.1252';
    DROP DATABASE scalelab;
                postgres    false                     2615    19017    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false         c           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   postgres    false    5         d           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    5         d           1247    19058    genericStatus    TYPE     ^   CREATE TYPE public."genericStatus" AS ENUM (
    'pending',
    'approved',
    'rejected'
);
 "   DROP TYPE public."genericStatus";
       public          postgres    false    5         ^           1247    19038    order_status    TYPE        CREATE TYPE public.order_status AS ENUM (
    'pending',
    'processing',
    'confirmed',
    'delivered',
    'canceled'
);
    DROP TYPE public.order_status;
       public          postgres    false    5         a           1247    19050    payment_status    TYPE     ]   CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'failed',
    'successful'
);
 !   DROP TYPE public.payment_status;
       public          postgres    false    5         [           1247    19030 	   user_role    TYPE     Y   CREATE TYPE public.user_role AS ENUM (
    'customer',
    'superadmin',
    'vendor'
);
    DROP TYPE public.user_role;
       public          postgres    false    5         �            1259    19018    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    postgres    false    5         �            1259    19104    items    TABLE     �  CREATE TABLE public.items (
    id integer NOT NULL,
    store_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    image_url text NOT NULL,
    available boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);
    DROP TABLE public.items;
       public         heap    postgres    false    5         �            1259    19103    items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.items_id_seq;
       public          postgres    false    5    223         e           0    0    items_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;
          public          postgres    false    222         �            1259    19126    order_items    TABLE     �   CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    item_id integer NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL
);
    DROP TABLE public.order_items;
       public         heap    postgres    false    5         �            1259    19125    order_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.order_items_id_seq;
       public          postgres    false    5    227         f           0    0    order_items_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;
          public          postgres    false    226         �            1259    19115    orders    TABLE     �  CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    store_id integer NOT NULL,
    timeslot_id integer NOT NULL,
    placed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delivery_location text NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    total_price double precision NOT NULL,
    vendor_id integer
);
    DROP TABLE public.orders;
       public         heap    postgres    false    862    5    862         �            1259    19114    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public          postgres    false    225    5         g           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public          postgres    false    224         �            1259    19140    payments    TABLE     �   CREATE TABLE public.payments (
    id integer NOT NULL,
    reference text NOT NULL,
    order_id integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL
);
    DROP TABLE public.payments;
       public         heap    postgres    false    5         �            1259    19139    payments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.payments_id_seq;
       public          postgres    false    231    5         h           0    0    payments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;
          public          postgres    false    230         �            1259    19091    stores    TABLE     �  CREATE TABLE public.stores (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    active boolean DEFAULT false,
    status public."genericStatus" DEFAULT 'pending'::public."genericStatus" NOT NULL,
    admin_open boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);
    DROP TABLE public.stores;
       public         heap    postgres    false    868    5    868         �            1259    19090    stores_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.stores_id_seq;
       public          postgres    false    221    5         i           0    0    stores_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;
          public          postgres    false    220         �            1259    19133 	   timeslots    TABLE     �   CREATE TABLE public.timeslots (
    id integer NOT NULL,
    start_time timestamp(6) without time zone NOT NULL,
    end_time timestamp(6) without time zone NOT NULL
);
    DROP TABLE public.timeslots;
       public         heap    postgres    false    5         �            1259    19132    timeslots_id_seq    SEQUENCE     �   CREATE SEQUENCE public.timeslots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.timeslots_id_seq;
       public          postgres    false    5    229         j           0    0    timeslots_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.timeslots_id_seq OWNED BY public.timeslots.id;
          public          postgres    false    228         �            1259    19066    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    user_name text NOT NULL,
    email text NOT NULL,
    phone_number text,
    password text,
    google_id text,
    role public.user_role DEFAULT 'customer'::public.user_role NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    "verificationToken" text,
    "resetToken" text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    859    859    5         �            1259    19065    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    217    5         k           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    216         �            1259    19078    vendors    TABLE     T  CREATE TABLE public.vendors (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    phone_number text NOT NULL,
    business_address text NOT NULL,
    "verificationToken" text,
    verified boolean DEFAULT false NOT NULL,
    recipient_code text,
    status public."genericStatus" DEFAULT 'pending'::public."genericStatus" NOT NULL,
    "resetToken" text,
    role text DEFAULT 'vendor'::text NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);
    DROP TABLE public.vendors;
       public         heap    postgres    false    868    868    5         �            1259    19077    vendors_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.vendors_id_seq;
       public          postgres    false    5    219         l           0    0    vendors_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;
          public          postgres    false    218         �           2604    19107    items id    DEFAULT     d   ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);
 7   ALTER TABLE public.items ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223         �           2604    19129    order_items id    DEFAULT     p   ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);
 =   ALTER TABLE public.order_items ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226    227         �           2604    19118 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224    225         �           2604    19143    payments id    DEFAULT     j   ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);
 :   ALTER TABLE public.payments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    230    231         �           2604    19094 	   stores id    DEFAULT     f   ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);
 8   ALTER TABLE public.stores ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221         �           2604    19136    timeslots id    DEFAULT     l   ALTER TABLE ONLY public.timeslots ALTER COLUMN id SET DEFAULT nextval('public.timeslots_id_seq'::regclass);
 ;   ALTER TABLE public.timeslots ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    229    229         �           2604    19069    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216    217         �           2604    19081 
   vendors id    DEFAULT     h   ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);
 9   ALTER TABLE public.vendors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219         L          0    19018    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          postgres    false    215       4940.dat T          0    19104    items 
   TABLE DATA           u   COPY public.items (id, store_id, name, description, price, image_url, available, created_at, updated_at) FROM stdin;
    public          postgres    false    223       4948.dat X          0    19126    order_items 
   TABLE DATA           M   COPY public.order_items (id, order_id, item_id, quantity, price) FROM stdin;
    public          postgres    false    227       4952.dat V          0    19115    orders 
   TABLE DATA           �   COPY public.orders (id, customer_id, store_id, timeslot_id, placed_at, delivery_location, status, total_price, vendor_id) FROM stdin;
    public          postgres    false    225       4950.dat \          0    19140    payments 
   TABLE DATA           C   COPY public.payments (id, reference, order_id, status) FROM stdin;
    public          postgres    false    231       4956.dat R          0    19091    stores 
   TABLE DATA           �   COPY public.stores (id, vendor_id, name, address, description, image_url, active, status, admin_open, created_at, updated_at) FROM stdin;
    public          postgres    false    221       4946.dat Z          0    19133 	   timeslots 
   TABLE DATA           =   COPY public.timeslots (id, start_time, end_time) FROM stdin;
    public          postgres    false    229       4954.dat N          0    19066    users 
   TABLE DATA           �   COPY public.users (id, user_name, email, phone_number, password, google_id, role, verified, "verificationToken", "resetToken", created_at, updated_at) FROM stdin;
    public          postgres    false    217       4942.dat P          0    19078    vendors 
   TABLE DATA           �   COPY public.vendors (id, name, email, password, phone_number, business_address, "verificationToken", verified, recipient_code, status, "resetToken", role, created_at, updated_at) FROM stdin;
    public          postgres    false    219       4944.dat m           0    0    items_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.items_id_seq', 1, false);
          public          postgres    false    222         n           0    0    order_items_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);
          public          postgres    false    226         o           0    0    orders_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.orders_id_seq', 1, false);
          public          postgres    false    224         p           0    0    payments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.payments_id_seq', 1, false);
          public          postgres    false    230         q           0    0    stores_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.stores_id_seq', 1, false);
          public          postgres    false    220         r           0    0    timeslots_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.timeslots_id_seq', 1, false);
          public          postgres    false    228         s           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public          postgres    false    216         t           0    0    vendors_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.vendors_id_seq', 1, false);
          public          postgres    false    218         �           2606    19026 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            postgres    false    215         �           2606    19113    items items_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.items DROP CONSTRAINT items_pkey;
       public            postgres    false    223         �           2606    19131    order_items order_items_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            postgres    false    227         �           2606    19124    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    225         �           2606    19148    payments payments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public            postgres    false    231         �           2606    19102    stores stores_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_pkey;
       public            postgres    false    221         �           2606    19138    timeslots timeslots_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.timeslots
    ADD CONSTRAINT timeslots_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.timeslots DROP CONSTRAINT timeslots_pkey;
       public            postgres    false    229         �           2606    19076    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    217         �           2606    19089    vendors vendors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.vendors DROP CONSTRAINT vendors_pkey;
       public            postgres    false    219         �           1259    19155    payments_reference_key    INDEX     W   CREATE UNIQUE INDEX payments_reference_key ON public.payments USING btree (reference);
 *   DROP INDEX public.payments_reference_key;
       public            postgres    false    231         �           1259    19149    users_email_key    INDEX     I   CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);
 #   DROP INDEX public.users_email_key;
       public            postgres    false    217         �           1259    19150    users_google_id_key    INDEX     Q   CREATE UNIQUE INDEX users_google_id_key ON public.users USING btree (google_id);
 '   DROP INDEX public.users_google_id_key;
       public            postgres    false    217         �           1259    19151    users_verificationToken_key    INDEX     e   CREATE UNIQUE INDEX "users_verificationToken_key" ON public.users USING btree ("verificationToken");
 1   DROP INDEX public."users_verificationToken_key";
       public            postgres    false    217         �           1259    19152    vendors_email_key    INDEX     M   CREATE UNIQUE INDEX vendors_email_key ON public.vendors USING btree (email);
 %   DROP INDEX public.vendors_email_key;
       public            postgres    false    219         �           1259    19153    vendors_phone_number_key    INDEX     [   CREATE UNIQUE INDEX vendors_phone_number_key ON public.vendors USING btree (phone_number);
 ,   DROP INDEX public.vendors_phone_number_key;
       public            postgres    false    219         �           1259    19154    vendors_verificationToken_key    INDEX     i   CREATE UNIQUE INDEX "vendors_verificationToken_key" ON public.vendors USING btree ("verificationToken");
 3   DROP INDEX public."vendors_verificationToken_key";
       public            postgres    false    219         �           2606    19161    items items_store_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON UPDATE CASCADE ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.items DROP CONSTRAINT items_store_id_fkey;
       public          postgres    false    221    4778    223         �           2606    19186 %   order_items order_items_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_order_id_fkey;
       public          postgres    false    227    225    4782         �           2606    19166    orders orders_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 H   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_customer_id_fkey;
       public          postgres    false    217    4770    225         �           2606    19171    orders orders_store_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_store_id_fkey;
       public          postgres    false    4778    221    225         �           2606    19176    orders orders_timeslot_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_timeslot_id_fkey FOREIGN KEY (timeslot_id) REFERENCES public.timeslots(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 H   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_timeslot_id_fkey;
       public          postgres    false    4786    229    225         �           2606    19181    orders orders_vendor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_vendor_id_fkey;
       public          postgres    false    219    225    4775         �           2606    19156    stores stores_vendor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_vendor_id_fkey;
       public          postgres    false    221    219    4775                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   4940.dat                                                                                            0000600 0004000 0002000 00000000303 14572657706 0014271 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        2ee3460e-5c64-4544-b932-e55f9ee884c0	dad74b6eef3bb841b9c3b8816004ee8cc4ea491e7c34cd7aa5f708cdac6693b7	2024-02-23 04:21:21.256786+01	20240223032120_init	\N	\N	2024-02-23 04:21:20.984819+01	1
\.


                                                                                                                                                                                                                                                                                                                             4948.dat                                                                                            0000600 0004000 0002000 00000000005 14572657706 0014300 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4952.dat                                                                                            0000600 0004000 0002000 00000000005 14572657706 0014273 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4950.dat                                                                                            0000600 0004000 0002000 00000000005 14572657706 0014271 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4956.dat                                                                                            0000600 0004000 0002000 00000000005 14572657706 0014277 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4946.dat                                                                                            0000600 0004000 0002000 00000000005 14572657706 0014276 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4954.dat                                                                                            0000600 0004000 0002000 00000000005 14572657706 0014275 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4942.dat                                                                                            0000600 0004000 0002000 00000000754 14572657706 0014305 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	johndoe123	johndoe@example.com	+1234567890	\N	1234567890	customer	f	\N	\N	2024-02-23 04:55:34.633	2024-02-23 04:55:34.633
2	johndoe123	johndoe2@example.com	+1234567890	\N	1234567990	customer	f	\N	\N	2024-02-23 04:55:46.145	2024-02-23 04:55:46.145
3	admin	ojebiyidaviddaniel@gmail.com	0900000000	$argon2id$v=19$m=65536,t=3,p=4$tK8TPlZ+wim4xG2SuflNFw$SkcQHxM9jJ0wrivNVUV3gko2AyYmWWDXUVfSWZY0z/g	\N	superadmin	t	6f419cd44a3ea90508172c08	\N	2024-02-23 05:23:31.938	2024-02-23 05:26:48.729
\.


                    4944.dat                                                                                            0000600 0004000 0002000 00000000005 14572657706 0014274 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           restore.sql                                                                                         0000600 0004000 0002000 00000050646 14572657706 0015422 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE scalelab;
--
-- Name: scalelab; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE scalelab WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Nigeria.1252';


ALTER DATABASE scalelab OWNER TO postgres;

\connect scalelab

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: genericStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."genericStatus" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public."genericStatus" OWNER TO postgres;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'processing',
    'confirmed',
    'delivered',
    'canceled'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'failed',
    'successful'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'customer',
    'superadmin',
    'vendor'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer NOT NULL,
    store_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    image_url text NOT NULL,
    available boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    item_id integer NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    store_id integer NOT NULL,
    timeslot_id integer NOT NULL,
    placed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delivery_location text NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    total_price double precision NOT NULL,
    vendor_id integer
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    reference text NOT NULL,
    order_id integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: stores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stores (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    active boolean DEFAULT false,
    status public."genericStatus" DEFAULT 'pending'::public."genericStatus" NOT NULL,
    admin_open boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.stores OWNER TO postgres;

--
-- Name: stores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stores_id_seq OWNER TO postgres;

--
-- Name: stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;


--
-- Name: timeslots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.timeslots (
    id integer NOT NULL,
    start_time timestamp(6) without time zone NOT NULL,
    end_time timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.timeslots OWNER TO postgres;

--
-- Name: timeslots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.timeslots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.timeslots_id_seq OWNER TO postgres;

--
-- Name: timeslots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.timeslots_id_seq OWNED BY public.timeslots.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_name text NOT NULL,
    email text NOT NULL,
    phone_number text,
    password text,
    google_id text,
    role public.user_role DEFAULT 'customer'::public.user_role NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    "verificationToken" text,
    "resetToken" text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    phone_number text NOT NULL,
    business_address text NOT NULL,
    "verificationToken" text,
    verified boolean DEFAULT false NOT NULL,
    recipient_code text,
    status public."genericStatus" DEFAULT 'pending'::public."genericStatus" NOT NULL,
    "resetToken" text,
    role text DEFAULT 'vendor'::text NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO postgres;

--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: stores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);


--
-- Name: timeslots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeslots ALTER COLUMN id SET DEFAULT nextval('public.timeslots_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.
COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM '$$PATH$$/4940.dat';

--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, store_id, name, description, price, image_url, available, created_at, updated_at) FROM stdin;
\.
COPY public.items (id, store_id, name, description, price, image_url, available, created_at, updated_at) FROM '$$PATH$$/4948.dat';

--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, item_id, quantity, price) FROM stdin;
\.
COPY public.order_items (id, order_id, item_id, quantity, price) FROM '$$PATH$$/4952.dat';

--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, customer_id, store_id, timeslot_id, placed_at, delivery_location, status, total_price, vendor_id) FROM stdin;
\.
COPY public.orders (id, customer_id, store_id, timeslot_id, placed_at, delivery_location, status, total_price, vendor_id) FROM '$$PATH$$/4950.dat';

--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, reference, order_id, status) FROM stdin;
\.
COPY public.payments (id, reference, order_id, status) FROM '$$PATH$$/4956.dat';

--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stores (id, vendor_id, name, address, description, image_url, active, status, admin_open, created_at, updated_at) FROM stdin;
\.
COPY public.stores (id, vendor_id, name, address, description, image_url, active, status, admin_open, created_at, updated_at) FROM '$$PATH$$/4946.dat';

--
-- Data for Name: timeslots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.timeslots (id, start_time, end_time) FROM stdin;
\.
COPY public.timeslots (id, start_time, end_time) FROM '$$PATH$$/4954.dat';

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, user_name, email, phone_number, password, google_id, role, verified, "verificationToken", "resetToken", created_at, updated_at) FROM stdin;
\.
COPY public.users (id, user_name, email, phone_number, password, google_id, role, verified, "verificationToken", "resetToken", created_at, updated_at) FROM '$$PATH$$/4942.dat';

--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors (id, name, email, password, phone_number, business_address, "verificationToken", verified, recipient_code, status, "resetToken", role, created_at, updated_at) FROM stdin;
\.
COPY public.vendors (id, name, email, password, phone_number, business_address, "verificationToken", verified, recipient_code, status, "resetToken", role, created_at, updated_at) FROM '$$PATH$$/4944.dat';

--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stores_id_seq', 1, false);


--
-- Name: timeslots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.timeslots_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 1, false);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: timeslots timeslots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeslots
    ADD CONSTRAINT timeslots_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: payments_reference_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payments_reference_key ON public.payments USING btree (reference);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_google_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_google_id_key ON public.users USING btree (google_id);


--
-- Name: users_verificationToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_verificationToken_key" ON public.users USING btree ("verificationToken");


--
-- Name: vendors_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX vendors_email_key ON public.vendors USING btree (email);


--
-- Name: vendors_phone_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX vendors_phone_number_key ON public.vendors USING btree (phone_number);


--
-- Name: vendors_verificationToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "vendors_verificationToken_key" ON public.vendors USING btree ("verificationToken");


--
-- Name: items items_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_timeslot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_timeslot_id_fkey FOREIGN KEY (timeslot_id) REFERENCES public.timeslots(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stores stores_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          