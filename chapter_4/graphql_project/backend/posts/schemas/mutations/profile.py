import strawberry
import strawberry_django
from strawberry_django.permissions import IsAuthenticated
from posts.models import UserProfile, Follow
from strawberry.file_uploads import Upload


@strawberry.type
class ProfileMutation: 
    @strawberry_django.mutation(extensions=[IsAuthenticated()])
    async def follow(self, info, id: strawberry.ID) -> bool:
        user = info.context["request"].user
        try:
            to_follow_profile = await UserProfile.objects.select_related("user").aget(id=id)
            current_profile = await UserProfile.objects.select_related("user").aget(user=user)
            if to_follow_profile == current_profile:
                raise Exception("You cannot follow yourself")
            
        except UserProfile.DoesNotExist:
            raise Exception("Profile not found")
        
        await Follow.objects.acreate(follower=current_profile, following=to_follow_profile)
        return True
    
    @strawberry_django.mutation(extensions=[IsAuthenticated()])
    async def unfollow(self, info, id: strawberry.ID) -> bool:
        user = info.context["request"].user    
        try:
            to_unfollow_profile = await UserProfile.objects.select_related("user").aget(id=id)
            current_profile = await UserProfile.objects.select_related("user").aget(user=user)
            if to_unfollow_profile == current_profile:
                raise Exception("You cannot unfollow yourself")
            
        except UserProfile.DoesNotExist:
            raise Exception("Profile not found")
        
        await Follow.objects.filter(follower=current_profile, following=to_unfollow_profile).adelete()
        return True
    
    @strawberry_django.mutation(extensions=[IsAuthenticated()])
    async def update_profile(self, info, bio: str | None = None, location: str | None = None, date_of_birth: str | None = None) -> bool:
        user = info.context["request"].user
        
        profile = await UserProfile.objects.aget(user=user)
        profile.bio = bio
        profile.location = location
        profile.date_of_birth = date_of_birth

        await profile.asave()

        return True
    
    @strawberry_django.mutation(extensions=[IsAuthenticated()])
    async def update_avatar(self, info, avatar: Upload) -> bool:
        user = info.context["request"].user
        profile = await UserProfile.objects.aget(user=user)
        
        profile.avatar = avatar
        
        await profile.asave()
        
        print("qqqq >", profile.__dict__, flush=1)
        return True
