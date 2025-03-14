import strawberry
import strawberry_django
from strawberry_django.permissions import IsAuthenticated
from posts.models import UserProfile

@strawberry.type
class ProfileMutation: 
    @strawberry_django.mutation(extensions=[IsAuthenticated()])
    async def follow(self, info, id: strawberry.ID) -> bool:
        user = info.context.request.user
        try:
            to_follow_profile = await UserProfile.objects.aget(id=id)
            current_profile = await UserProfile.objects.aget(user=user)
            if to_follow_profile == current_profile:
                raise Exception("You cannot follow yourself")
            
            current_profile.following.add(to_follow_profile)
            await current_profile.asave()
            return True
        except UserProfile.DoesNotExist:
            raise Exception("Profile not found")
    
    @strawberry_django.mutation(extensions=[IsAuthenticated()])
    async def unfollow(self, info, id: strawberry.ID) -> bool:
        user = info.context.request.user    
        try:
            to_unfollow_profile = await UserProfile.objects.aget(id=id)
            current_profile = await UserProfile.objects.aget(user=user)
            if to_unfollow_profile == current_profile:
                raise Exception("You cannot unfollow yourself")
            
            current_profile.following.remove(to_unfollow_profile)
            await current_profile.asave()
            return True
        except UserProfile.DoesNotExist:
            raise Exception("Profile not found")
        